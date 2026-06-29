import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, token, password } = await req.json()
    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.resetToken || !user.resetTokenExpires) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    if (user.resetToken !== token) {
      return NextResponse.json({ error: 'Invalid or expired reset link' }, { status: 400 })
    }

    if (user.resetTokenExpires < new Date()) {
      return NextResponse.json({ error: 'Reset link has expired. Please request a new one.' }, { status: 400 })
    }

    const newHash = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash, resetToken: null, resetTokenExpires: null },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
