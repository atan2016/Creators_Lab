import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateGoogleDriveUrl } from '@/lib/googledrive'

// GET - List all Google Drive links
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await prisma.googleDriveLink.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ links })
  } catch (error: any) {
    console.error('Error fetching Google Drive links:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new Google Drive link
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, driveUrl, description } = body

    if (!name || !driveUrl) {
      return NextResponse.json(
        { error: 'Name and Drive URL are required' },
        { status: 400 }
      )
    }

    if (!validateGoogleDriveUrl(driveUrl)) {
      return NextResponse.json(
        { error: 'Invalid Google Drive URL format' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    const link = await prisma.googleDriveLink.create({
      data: {
        name,
        driveUrl,
        description: description || null,
        createdById: userId,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating Google Drive link:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
