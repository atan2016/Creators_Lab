import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update location
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, address, city, state, zipCode } = body

    if (!name || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'All location fields are required' },
        { status: 400 }
      )
    }

    const location = await prisma.location.findUnique({
      where: { id },
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name,
        address,
        city,
        state,
        zipCode,
      },
    })

    return NextResponse.json({ location: updatedLocation })
  } catch (error: any) {
    console.error('Error updating location:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete location
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        schedules: {
          take: 1,
        },
      },
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    if (location.schedules.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete location with existing schedules' },
        { status: 400 }
      )
    }

    await prisma.location.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting location:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
