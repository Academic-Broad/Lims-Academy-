import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const payments = await prisma.payment.findMany({
      where: { parentId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true, invoiceNo: true, amount: true, paidAmount: true,
        description: true, feeType: true, paymentMethod: true,
        status: true, dueDate: true, paidAt: true, createdAt: true,
        student: { select: { id: true, firstName: true, lastName: true, grade: true } },
        parent: { select: { name: true } },
      },
    })
    return NextResponse.json({ payments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
  }
}
