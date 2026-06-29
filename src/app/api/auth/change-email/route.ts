import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { password, newEmail } = await req.json()
    if (!password || !newEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 400 })
    }

    if (newEmail === user.email) {
      return NextResponse.json({ error: 'New email is the same as your current email' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email: newEmail } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { email: newEmail },
    })

    return NextResponse.json({ success: true, message: 'Email updated successfully. Please sign out and sign back in.' })
  } catch (error) {
    console.error('Change email error:', error)
    return NextResponse.json({ error: 'Failed to change email' }, { status: 500 })
  }
}
