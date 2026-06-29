import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-paystack-signature')

    if (PAYSTACK_SECRET_KEY && signature) {
      const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(body)
        .digest('hex')

      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.success') {
      const { reference, status, amount, metadata } = event.data

      if (status !== 'success') {
        return NextResponse.json({ status: 'ignored' })
      }

      const txn = await prisma.paystackTransaction.findUnique({
        where: { reference },
        include: { payment: true },
      })

      if (!txn) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }

      if (txn.payment.status === 'Paid') {
        return NextResponse.json({ status: 'already_processed' })
      }

      const paidAmount = amount / 100
      const channel = event.data.channel || event.data.authorization?.channel || null

      const channelToMethod: Record<string, string> = {
        card: 'card',
        bank: 'bank_transfer',
        bank_transfer: 'bank_transfer',
        transfer: 'bank_transfer',
        ussd: 'ussd',
        mobile_money: 'mobile_money',
        qr: 'qr',
      }
      const paymentMethod = channel ? (channelToMethod[channel] || channel) : null

      await prisma.$transaction([
        prisma.payment.update({
          where: { id: txn.paymentId },
          data: {
            paidAmount,
            status: 'Paid',
            paidAt: new Date(),
            paymentMethod,
          },
        }),
        prisma.paystackTransaction.update({
          where: { id: txn.id },
          data: {
            status: 'success',
            paystackData: body,
          },
        }),
      ])
    }

    return NextResponse.json({ status: 'received' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
