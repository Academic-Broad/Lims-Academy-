import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Role } from '@/lib/roles'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const categories = await prisma.feeCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Fetch fee categories error:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { value, label, description } = await req.json()
    if (!value || !label) {
      return NextResponse.json({ error: 'Value and label are required' }, { status: 400 })
    }

    const maxOrder = await prisma.feeCategory.findFirst({ orderBy: { sortOrder: 'desc' } })
    const category = await prisma.feeCategory.create({
      data: { value, label, description, sortOrder: (maxOrder?.sortOrder ?? -1) + 1 },
    })
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Create fee category error:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, value, label, description, sortOrder, isActive } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    if (value !== undefined) data.value = value
    if (label !== undefined) data.label = label
    if (description !== undefined) data.description = description
    if (sortOrder !== undefined) data.sortOrder = sortOrder
    if (isActive !== undefined) data.isActive = isActive

    const category = await prisma.feeCategory.update({ where: { id }, data })
    return NextResponse.json(category)
  } catch (error) {
    console.error('Update fee category error:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.feeCategory.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete fee category error:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
