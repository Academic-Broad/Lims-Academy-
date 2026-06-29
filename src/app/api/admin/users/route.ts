import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail, getPasswordSetupEmail } from '@/lib/email'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'
import { Role } from '@/lib/roles'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { parentName, parentEmail, parentPhone, studentFirstName, studentLastName, studentAge, studentGrade, sendEmail: shouldSendEmail } = await req.json()

    if (!parentName || !parentEmail || !studentFirstName || !studentLastName || !studentAge || !studentGrade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email: parentEmail } })
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    const tempToken = uuid()
    const tempHash = await bcrypt.hash(tempToken, 10)

    const parent = await prisma.user.create({
      data: {
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        role: Role.PARENT,
        passwordHash: tempHash,
      },
    })

    const student = await prisma.student.create({
      data: {
        firstName: studentFirstName,
        lastName: studentLastName,
        age: Number(studentAge),
        grade: studentGrade,
      },
    })

    await prisma.parentStudent.create({
      data: {
        parentId: parent.id,
        studentId: student.id,
      },
    })

    await prisma.payment.create({
      data: {
        invoiceNo: `INV-${Date.now()}`,
        studentId: student.id,
        parentId: parent.id,
        amount: 50000,
        description: `Tuition Fee - ${studentGrade} - ${studentFirstName} ${studentLastName}`,
        status: 'Pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })

    if (shouldSendEmail !== false) {
      const setupLink = `${process.env.NEXTAUTH_URL}/login?setup=${tempToken}&email=${encodeURIComponent(parentEmail)}`
      const emailContent = getPasswordSetupEmail(parentName, setupLink)
      await sendEmail({ to: parentEmail, ...emailContent })
    }

    return NextResponse.json({
      success: true,
      parent: { id: parent.id, name: parent.name, email: parent.email },
      student: { id: student.id, name: `${student.firstName} ${student.lastName}` },
      tempPassword: tempToken,
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: Role.PARENT },
      include: {
        parentStudents: {
          include: { student: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
