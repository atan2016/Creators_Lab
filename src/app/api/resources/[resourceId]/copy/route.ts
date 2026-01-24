import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { resourceId } = await params
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        classroom: true,
      },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    const userId = (session.user as any).id

    // Verify user is a member of the classroom
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: resource.classroom.id,
          userId,
        },
      },
    })

    if (!membership && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'You must be a member of this classroom to copy resources' },
        { status: 403 }
      )
    }

    // Check if already copied
    const existingCopy = await prisma.resourceCopy.findUnique({
      where: {
        resourceId_userId: {
          resourceId,
          userId,
        },
      },
    })

    if (existingCopy) {
      return NextResponse.json(
        { error: 'Resource already copied', copy: existingCopy },
        { status: 400 }
      )
    }

    const copy = await prisma.resourceCopy.create({
      data: {
        resourceId,
        userId,
      },
    })

    return NextResponse.json({ copy }, { status: 201 })
  } catch (error) {
    console.error('Error copying resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
