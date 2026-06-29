import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuid } from 'uuid'
import { Role } from '@/lib/roles'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.PARENT) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { studentId, feeType, amount, description, channel } = await req.json()

    if (!studentId || !feeType || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment parameters' }, { status: 400 })
    }

    const validChannels = ['card', 'bank_transfer', 'ussd']
    const channels = channel && validChannels.includes(channel)
      ? [channel]
      : ['card', 'bank_transfer', 'ussd']

    const parentStudent = await prisma.parentStudent.findFirst({
      where: { parentId: session.user.id, studentId },
      include: { student: true },
    })
    if (!parentStudent) {
      return NextResponse.json({ error: 'Student not linked to your account' }, { status: 403 })
    }

    const reference = `LIMS-${uuid().split('-')[0]}-${Date.now()}`
    const amountInKobo = Math.round(amount * 100)

    let paystackResponse
    if (PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY.startsWith('sk_')) {
      const resp = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          amount: amountInKobo,
          reference,
          channels,
          metadata: {
            studentId,
            studentName: `${parentStudent.student.firstName} ${parentStudent.student.lastName}`,
            feeType,
            parentId: session.user.id,
            channel,
          },
        }),
      })
      paystackResponse = await resp.json()
      if (!paystackResponse.status) {
        throw new Error(paystackResponse.message || 'Paystack initialization failed')
      }
    }

    const payment = await prisma.payment.create({
      data: {
        invoiceNo: reference,
        studentId,
        parentId: session.user.id,
        amount,
        paidAmount: 0,
        description: description || `${feeType} - ${parentStudent.student.firstName} ${parentStudent.student.lastName}`,
        feeType,
        paymentMethod: channel || null,
        status: 'Pending',
      },
    })

    await prisma.paystackTransaction.create({
      data: {
        paymentId: payment.id,
        reference,
        amount,
        status: 'pending',
        paystackData: paystackResponse ? JSON.stringify(paystackResponse) : null,
      },
    })

    return NextResponse.json({
      success: true,
      reference,
      amount,
      channels,
      access_code: paystackResponse?.data?.access_code,
      authorization_url: paystackResponse?.data?.authorization_url,
      public_key: process.env.PAYSTACK_PUBLIC_KEY || '',
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Payment init error:', error)
    const message = error instanceof Error ? error.message : 'Payment initialization failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
