import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@/lib/roles'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const approvals = await prisma.pendingApproval.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(approvals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, action } = await req.json()
    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const approval = await prisma.pendingApproval.findUnique({ where: { id } })
    if (!approval || approval.status !== 'Pending') {
      return NextResponse.json({ error: 'Approval request not found or already processed' }, { status: 404 })
    }

    if (action === 'reject') {
      await prisma.pendingApproval.update({
        where: { id },
        data: { status: 'Rejected', reviewedBy: session.user.id, reviewedAt: new Date() },
      })
      return NextResponse.json({ success: true, status: 'Rejected' })
    }

    if (action !== 'approve') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const defaultPassword = "parent123"
    const passwordHash = await bcrypt.hash(defaultPassword, 10)

    const nameParts = approval.studentName.trim().split(/\s+/)

    const result = await prisma.$transaction(async (tx) => {
      const existingParent = await tx.user.findUnique({ where: { email: approval.parentEmail } })

      let parent
      let isNewParent = false

      if (existingParent) {
        parent = existingParent
      } else {
        parent = await tx.user.create({
          data: {
            name: approval.parentName,
            email: approval.parentEmail,
            phone: approval.parentPhone,
            role: Role.PARENT,
            passwordHash,
          },
        })
        isNewParent = true
      }

      const student = await tx.student.create({
        data: {
          firstName: nameParts[0] || approval.studentName,
          lastName: nameParts.slice(1).join(' ') || 'Student',
          age: approval.studentAge,
          grade: approval.studentGrade,
        },
      })

      await tx.parentStudent.create({
        data: { parentId: parent.id, studentId: student.id },
      })

      await tx.payment.create({
        data: {
          invoiceNo: `INV-${Date.now()}`,
          studentId: student.id,
          parentId: parent.id,
          amount: 50000,
          description: `Tuition Fee - ${approval.studentGrade} - ${approval.studentName}`,
          status: 'Pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })

      await tx.pendingApproval.update({
        where: { id },
        data: { status: 'Approved', reviewedBy: session.user.id, reviewedAt: new Date() },
      })

      return { parent, student, isNewParent }
    })

    return NextResponse.json({
      success: true,
      status: 'Approved',
      isNewParent: result.isNewParent,
      defaultPassword: result.isNewParent ? defaultPassword : undefined,
      message: result.isNewParent
        ? `Student approved. Parent can log in with email ${approval.parentEmail} and password "${defaultPassword}".`
        : 'Student approved and linked to existing parent account.',
      parent: { id: result.parent.id, name: result.parent.name, email: result.parent.email },
      student: { id: result.student.id, name: `${result.student.firstName} ${result.student.lastName}` },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Approval error:', message, error)
    if (message.includes('Unique constraint') || message.includes('unique')) {
      return NextResponse.json({ error: 'A user with this email already exists. The parent may have already been registered.' }, { status: 409 })
    }
    return NextResponse.json({ error: `Failed to process approval: ${message}` }, { status: 500 })
  }
}
