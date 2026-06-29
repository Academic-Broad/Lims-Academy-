import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import { Role } from '@/lib/roles'
import Flutterwave from 'flutterwave-node-v3'

const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.PARENT) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { studentId, feeType, amount, description } = await req.json()

    if (!studentId || !feeType || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment parameters' }, { status: 400 })
    }

    const parentStudent = await prisma.parentStudent.findFirst({
      where: { parentId: session.user.id, studentId },
      include: { student: true },
    })
    if (!parentStudent) {
      return NextResponse.json({ error: 'Student not linked to your account' }, { status: 403 })
    }

    const tx_ref = `LIMS-${uuid().split('-')[0]}-${Date.now()}`

    const payload = {
      tx_ref,
      amount: amount.toString(),
      currency: 'NGN',
      redirect_url: `${process.env.NEXTAUTH_URL}/parent/dashboard`,
      customer: {
        email: session.user.email!,
        name: session.user.name,
      },
      meta: {
        studentId,
        studentName: `${parentStudent.student.firstName} ${parentStudent.student.lastName}`,
        feeType,
        parentId: session.user.id,
      },
    }

    let flutterwaveLink: string | null = null
    if (process.env.FLW_SECRET_KEY && process.env.FLW_SECRET_KEY.startsWith('FLWSECK')) {
      const response = await flw.Payment.initiate(payload)
      if (response.status === 'success' || response.status === 'successful') {
        flutterwaveLink = response.data.link
      } else {
        throw new Error(response.message || 'Flutterwave initialization failed')
      }
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceNo: tx_ref,
        studentId,
        parentId: session.user.id,
        amount,
        paidAmount: 0,
        description: description || `${feeType} - ${parentStudent.student.firstName} ${parentStudent.student.lastName}`,
        feeType,
        status: 'Pending',
      },
    })

    await prisma.flutterwaveTransaction.create({
      data: {
        paymentId: payment.id,
        reference: tx_ref,
        amount,
        status: 'pending',
        flutterwaveData: flutterwaveLink ? JSON.stringify({ link: flutterwaveLink }) : null,
      },
    })

    return NextResponse.json({
      success: true,
      reference: tx_ref,
      amount,
      authorization_url: flutterwaveLink,
      checkoutUrl: flutterwaveLink,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Payment init error:', error)
    const message = error instanceof Error ? error.message : 'Payment initialization failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
