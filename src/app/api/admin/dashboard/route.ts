import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/roles'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [
      totalStudents,
      totalParents,
      pendingApprovals,
      totalRevenue,
      recentPayments,
      recentMessages,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.user.count({ where: { role: Role.PARENT } }),
      prisma.pendingApproval.count({ where: { status: 'Pending' } }),
      prisma.payment.aggregate({ _sum: { paidAmount: true }, where: { status: 'Paid' } }),
      prisma.payment.findMany({ where: { status: 'Paid' }, orderBy: { paidAt: 'desc' }, take: 5, include: { student: true, parent: true } }),
      prisma.contactMessage.findMany({ where: { isRead: false }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ])

    return NextResponse.json({
      stats: {
        totalStudents,
        totalParents,
        pendingApprovals,
        totalRevenue: totalRevenue._sum.paidAmount || 0,
      },
      recentPayments,
      recentMessages,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard' }, { status: 500 })
  }
}
