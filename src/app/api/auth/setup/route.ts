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
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValidToken = await bcrypt.compare(token, user.passwordHash)
    if (!isValidToken) {
      return NextResponse.json({ error: 'Invalid or expired setup link' }, { status: 400 })
    }

    const newHash = await bcrypt.hash(password, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Failed to set password' }, { status: 500 })
  }
}
