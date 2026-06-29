import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, getPasswordResetEmail } from '@/lib/email'
import { v4 as uuid } from 'uuid'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'If an account with that email exists, a reset link has been sent.' }, { status: 200 })
    }

    const resetToken = uuid()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpires: expiresAt },
    })

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    const emailContent = getPasswordResetEmail(user.name, resetLink)
    try {
      await sendEmail({ to: email, ...emailContent })
    } catch (err) {
      console.error('Failed to send reset email:', err)
      return NextResponse.json({ error: `Failed to send reset email: ${err instanceof Error ? err.message : 'Unknown error'}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
