import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/roles'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter')

    const where: Record<string, unknown> = {}
    if (filter === 'unread') where.isRead = false
    else if (filter === 'read') where.isRead = true

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Fetch messages error:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, action } = await req.json()
    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (action === 'mark-read') {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'mark-unread') {
      await prisma.contactMessage.update({
        where: { id },
        data: { isRead: false },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Update message error:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}
