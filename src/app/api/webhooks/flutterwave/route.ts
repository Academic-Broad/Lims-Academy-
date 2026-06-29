import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const hash = req.headers.get('verif-hash')

    if (process.env.FLW_WEBHOOK_HASH && hash) {
      if (hash !== process.env.FLW_WEBHOOK_HASH) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(body)

    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const { tx_ref, amount, id, meta } = event.data

      const txn = await prisma.flutterwaveTransaction.findUnique({
        where: { reference: tx_ref },
        include: { payment: true },
      })

      if (!txn) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }

      if (txn.payment.status === 'Paid') {
        return NextResponse.json({ status: 'already_processed' })
      }

      const paidAmount = amount

      let paymentMethod: string | null = null
      const paymentType = event.data.payment_type
      if (paymentType === 'card' || paymentType === 'credit') paymentMethod = 'card'
      else if (paymentType?.includes('transfer') || paymentType === 'bank_transfer') paymentMethod = 'bank_transfer'
      else if (paymentType === 'ussd') paymentMethod = 'ussd'
      else if (paymentType === 'mobile_money') paymentMethod = 'mobile_money'
      else paymentMethod = paymentType || null

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
        prisma.flutterwaveTransaction.update({
          where: { id: txn.id },
          data: {
            status: 'success',
            flutterwaveData: body,
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
