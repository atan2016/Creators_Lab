import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateGoogleDriveUrl } from '@/lib/googledrive'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        _count: {
          select: {
            resources: true,
            forumPosts: true,
          },
        },
      },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    // Check if user has access
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const isCreator = classroom.creatorId === userId
    const isMember = classroom.members.some(m => m.userId === userId)

    if (!isCreator && !isMember && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({ classroom })
  } catch (error) {
    console.error('Error fetching classroom:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    // Only creator or admin can delete
    const userId = (session.user as any).id
    const role = (session.user as any).role

    if (classroom.creatorId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only the classroom creator can delete it' },
        { status: 403 }
      )
    }

    await prisma.classroom.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting classroom:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    // Only creator or admin can update
    const userId = (session.user as any).id
    const role = (session.user as any).role

    if (classroom.creatorId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only the classroom creator can update it' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, googleDriveUrl } = body

    if (name !== undefined && !name) {
      return NextResponse.json(
        { error: 'Classroom name cannot be empty' },
        { status: 400 }
      )
    }

    // Validate Document Drive URL if provided
    if (googleDriveUrl !== undefined && googleDriveUrl && !validateGoogleDriveUrl(googleDriveUrl)) {
      return NextResponse.json(
        { error: 'Invalid Document Drive URL format' },
        { status: 400 }
      )
    }

    const updatedClassroom = await prisma.classroom.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(googleDriveUrl !== undefined && { googleDriveUrl: googleDriveUrl || null }),
      },
    })

    return NextResponse.json({ classroom: updatedClassroom })
  } catch (error: any) {
    console.error('Error updating classroom:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
