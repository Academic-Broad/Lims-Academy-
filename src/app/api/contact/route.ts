import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@limsacademy.edu',
      subject: `New Contact Message from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject || 'N/A'}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    })

    return NextResponse.json({ success: true, id: contact.id })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
