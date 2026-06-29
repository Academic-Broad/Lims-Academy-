import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  const existing = await prisma.user.findUnique({ where: { email: 'admin@lims.com' } })
  if (existing) {
    return NextResponse.json({ message: 'Admin already exists' })
  }

  const hash = await bcrypt.hash('password123', 10)
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@lims.com',
      role: 'ADMIN',
      passwordHash: hash,
    },
  })

  return NextResponse.json({ message: 'Admin created successfully' })
}
