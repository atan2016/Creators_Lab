import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateGitHubUrl } from '@/lib/github'
import { validateGoogleDriveUrl } from '@/lib/googledrive'
import { logResourceActivity, ActivityAction } from '@/lib/activity-log'

export async function POST(
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
    const body = await request.json()
    const { title, description, type, content, githubUrl, googleDriveUrl } = body

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      )
    }

    // Verify classroom exists and user is creator
    const classroom = await prisma.classroom.findUnique({
      where: { id },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Check if user is creator, admin, or a teacher member
    const isCreator = classroom.creatorId === userId
    const isAdmin = role === 'ADMIN'
    
    if (!isCreator && !isAdmin) {
      // Check if teacher is a member
      const membership = await prisma.classroomMember.findUnique({
        where: {
          classroomId_userId: {
            classroomId: id,
            userId,
          },
        },
      })
      
      if (!membership) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    // Validate GitHub URL if provided
    if (type === 'GITHUB_LINK') {
      if (!githubUrl) {
        return NextResponse.json(
          { error: 'GitHub URL is required for GitHub link resources' },
          { status: 400 }
        )
      }
      if (!validateGitHubUrl(githubUrl)) {
        return NextResponse.json(
          { error: 'Invalid GitHub URL format' },
          { status: 400 }
        )
      }
    }

    // Validate Document Drive URL if provided
    if (type === 'GOOGLE_DRIVE_LINK') {
      if (!googleDriveUrl) {
        return NextResponse.json(
          { error: 'Document Drive URL is required for Document Drive link resources' },
          { status: 400 }
        )
      }
      if (!validateGoogleDriveUrl(googleDriveUrl)) {
        return NextResponse.json(
          { error: 'Invalid Document Drive URL format' },
          { status: 400 }
        )
      }
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || null,
        type,
        content: (type === 'GITHUB_LINK' || type === 'GOOGLE_DRIVE_LINK') ? null : (content || null),
        githubUrl: type === 'GITHUB_LINK' ? githubUrl : null,
        googleDriveUrl: type === 'GOOGLE_DRIVE_LINK' ? googleDriveUrl : null,
        classroomId: id,
        createdById: userId,
      },
    })

    // Log activity if user is a teacher (not admin)
    if (role === 'TEACHER') {
      await logResourceActivity(userId, ActivityAction.CREATE, resource.id, resource.title, resource.type)
    }

    return NextResponse.json({ resource }, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    // Verify user has access to classroom
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const classroom = await prisma.classroom.findUnique({
      where: { id },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    const isCreator = classroom.creatorId === userId
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: id,
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

    const resources = await prisma.resource.findMany({
      where: { classroomId: id },
      include: {
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ resources })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
