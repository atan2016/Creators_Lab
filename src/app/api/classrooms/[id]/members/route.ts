import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Add a student or teacher to a classroom
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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
    if (classroom.creatorId !== userId && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only the classroom creator or admin can add members.' },
        { status: 403 }
      )
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User with this email not found' },
        { status: 404 }
      )
    }

    // Allow students and teachers to be added
    // Admins can add teachers, regular teachers can only add students
    if (user.role !== 'STUDENT' && user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only students and teachers can be added to classrooms' },
        { status: 400 }
      )
    }

    // Non-admin teachers can only add students
    if ((session.user as any).role !== 'ADMIN' && user.role === 'TEACHER') {
      return NextResponse.json(
        { error: 'Only admins can add teachers to classrooms' },
        { status: 403 }
      )
    }

    // Check if already a member
    const existingMember = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: id,
          userId: user.id,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this classroom' },
        { status: 400 }
      )
    }

    // Add user to classroom
    await prisma.classroomMember.create({
      data: {
        classroomId: id,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    console.error('Error adding student to classroom:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
