import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { validateGoogleDriveUrl } from '@/lib/googledrive'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, googleDriveUrl } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Classroom name is required' },
        { status: 400 }
      )
    }

    // Validate Google Drive URL if provided
    if (googleDriveUrl && !validateGoogleDriveUrl(googleDriveUrl)) {
      return NextResponse.json(
        { error: 'Invalid Google Drive URL format' },
        { status: 400 }
      )
    }

    // Generate unique invite code
    const inviteCode = randomBytes(4).toString('hex').toUpperCase()

    const classroom = await prisma.classroom.create({
      data: {
        name,
        description: description || null,
        googleDriveUrl: googleDriveUrl || null,
        inviteCode,
        creatorId: (session.user as any).id,
      },
    })

    return NextResponse.json({ classroom }, { status: 201 })
  } catch (error) {
    console.error('Error creating classroom:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = (session.user as any).role
    const userId = (session.user as any).id

    let classrooms

    if (role === 'ADMIN') {
      // Admins can see all classrooms
      classrooms = await prisma.classroom.findMany({
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              members: true,
              resources: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else if (role === 'TEACHER') {
      classrooms = await prisma.classroom.findMany({
        where: { creatorId: userId },
        include: {
          _count: {
            select: {
              members: true,
              resources: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      const memberships = await prisma.classroomMember.findMany({
        where: { userId },
        include: {
          classroom: {
            include: {
              _count: {
                select: {
                  members: true,
                  resources: true,
                },
              },
            },
          },
        },
      })
      classrooms = memberships.map(m => m.classroom)
    }

    return NextResponse.json({ classrooms })
  } catch (error) {
    console.error('Error fetching classrooms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
