import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logResourceActivity, ActivityAction } from '@/lib/activity-log'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; resourceId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
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
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Verify user has access to classroom
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const isCreator = resource.classroom.creatorId === userId
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: resource.classroom.id,
          userId,
        },
      },
    })

    if (!isCreator && !membership && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Check if student has copied this resource
    let hasCopied = false
    if (role === 'STUDENT' || role === 'ADMIN') {
      const copy = await prisma.resourceCopy.findUnique({
        where: {
          resourceId_userId: {
            resourceId,
            userId,
          },
        },
      })
      hasCopied = !!copy
    }

    return NextResponse.json({ resource, hasCopied })
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; resourceId: string }> }
) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
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
    const role = (session.user as any).role
    if (resource.createdById !== userId && resource.classroom.creatorId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const resourceTitle = resource.title
    const resourceType = resource.type

    await prisma.resource.delete({
      where: { id: resourceId },
    })

    // Log activity if user is a teacher (not admin)
    if (role === 'TEACHER') {
      await logResourceActivity(userId, ActivityAction.DELETE, resourceId, resourceTitle, resourceType)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
