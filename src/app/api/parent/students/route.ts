import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/roles'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.PARENT) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const parentWithStudents = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        parentStudents: {
          include: {
            student: {
              include: {
                payments: {
                  orderBy: { createdAt: 'desc' },
                  take: 20,
                  select: {
                    id: true, invoiceNo: true, amount: true, paidAmount: true,
                    description: true, feeType: true, status: true,
                    dueDate: true, paidAt: true, createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!parentWithStudents) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    const students = parentWithStudents.parentStudents.map((ps) => ({
      relationship: ps.relationship,
      ...ps.student,
    }))

    return NextResponse.json({ students })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}
