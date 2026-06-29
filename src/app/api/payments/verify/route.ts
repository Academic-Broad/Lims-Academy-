import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/roles'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.PARENT) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { reference } = await req.json()
    if (!reference) {
      return NextResponse.json({ error: 'Reference required' }, { status: 400 })
    }

    if (PAYSTACK_SECRET_KEY && PAYSTACK_SECRET_KEY.startsWith('sk_')) {
      const resp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
      })
      const data = await resp.json()

      if (!data.status || data.data.status !== 'success') {
        return NextResponse.json({ error: 'Payment not confirmed by Paystack' }, { status: 400 })
      }
    }

    const payment = await prisma.payment.findFirst({
      where: { invoiceNo: reference, parentId: session.user.id },
      include: { student: true, parent: true },
    })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    if (payment.status !== 'Paid') {
      const paidAmount = payment.amount
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paidAmount,
          status: 'Paid',
          paidAt: new Date(),
        },
      })
      await prisma.paystackTransaction.updateMany({
        where: { reference },
        data: { status: 'success' },
      })

      payment.status = 'Paid'
      payment.paidAmount = paidAmount
      payment.paidAt = new Date()
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        invoiceNo: payment.invoiceNo,
        amount: payment.amount,
        paidAmount: payment.paidAmount,
        description: payment.description,
        feeType: payment.feeType,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        paidAt: payment.paidAt?.toISOString() || null,
        student: {
          firstName: payment.student.firstName,
          lastName: payment.student.lastName,
          grade: payment.student.grade,
        },
      },
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
