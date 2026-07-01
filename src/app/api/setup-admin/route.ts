export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@lims.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Admin account already exists!" });
    }

    const hashedPassword = await bcrypt.hash('password123', 12);

    await prisma.user.create({
      data: {
        name: 'System Admin',
        email: 'admin@lims.com',
        passwordHash: hashedPassword,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ message: "Admin created successfully!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
