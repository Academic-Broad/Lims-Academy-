import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { Role } from '@/lib/roles'

export async function GET() {
  try {
    const existing = await prisma.user.findUnique({ where: { email: 'admin@lims.com' } })
    if (existing) {
      return NextResponse.json({ message: 'Admin already exists' })
    }

    const passwordHash = await bcrypt.hash('password123', 10)
    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@lims.com',
        passwordHash,
        role: Role.ADMIN,
      },
    })
    return NextResponse.json({ message: 'Admin created successfully!' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
  }
}
