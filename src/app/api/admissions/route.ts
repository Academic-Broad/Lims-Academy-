import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { parentName, parentEmail, parentPhone, studentName, studentAge, studentGrade, message } = await req.json()
    if (!parentName || !parentEmail || !studentName || !studentAge || !studentGrade) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pending = await prisma.pendingApproval.create({
      data: {
        parentName,
        parentEmail,
        parentPhone,
        studentName,
        studentAge: Number(studentAge),
        studentGrade,
        message,
        status: 'Pending',
      },
    })

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@limsacademy.edu',
      subject: `New Enrollment Application for ${studentName}`,
      html: `<p><strong>Parent:</strong> ${parentName} (${parentEmail})</p><p><strong>Student:</strong> ${studentName}</p><p><strong>Grade:</strong> ${studentGrade}</p><p><strong>Age:</strong> ${studentAge}</p><p><strong>Message:</strong> ${message || 'N/A'}</p>`,
    })

    return NextResponse.json({ success: true, id: pending.id })
  } catch (error) {
    console.error('Admission error:', error)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}
