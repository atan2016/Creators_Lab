import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all locations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ locations })
  } catch (error: any) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new location (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, city, state, zipCode } = body

    if (!name || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'All location fields are required' },
        { status: 400 }
      )
    }

    const location = await prisma.location.create({
      data: {
        name,
        address,
        city,
        state,
        zipCode,
      },
    })

    return NextResponse.json({ location }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
