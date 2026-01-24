import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateGitHubUrl } from '@/lib/github'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ homeworkId: string }> }
) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { homeworkId } = await params
    const body = await request.json()
    const { githubUrl } = body

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    if (!validateGitHubUrl(githubUrl)) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    // Verify resource exists and is homework
    const resource = await prisma.resource.findUnique({
      where: { id: homeworkId },
      include: {
        classroom: true,
      },
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Homework not found' },
        { status: 404 }
      )
    }

    if (resource.type !== 'HOMEWORK') {
      return NextResponse.json(
        { error: 'Resource is not a homework assignment' },
        { status: 400 }
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
        { error: 'You must be a member of this classroom to submit homework' },
        { status: 403 }
      )
    }

    // Check if submission already exists
    const existingSubmission = await prisma.homeworkSubmission.findUnique({
      where: {
        homeworkId_studentId: {
          homeworkId,
          studentId: userId,
        },
      },
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Submission already exists. Use PUT to update.' },
        { status: 400 }
      )
    }

    const submission = await prisma.homeworkSubmission.create({
      data: {
        homeworkId,
        studentId: userId,
        githubUrl,
      },
    })

    return NextResponse.json({ submission }, { status: 201 })
  } catch (error) {
    console.error('Error submitting homework:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ homeworkId: string }> }
) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { homeworkId } = await params
    const body = await request.json()
    const { githubUrl } = body

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      )
    }

    if (!validateGitHubUrl(githubUrl)) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    const submission = await prisma.homeworkSubmission.update({
      where: {
        homeworkId_studentId: {
          homeworkId,
          studentId: userId,
        },
      },
      data: {
        githubUrl,
      },
    })

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Error updating homework submission:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
