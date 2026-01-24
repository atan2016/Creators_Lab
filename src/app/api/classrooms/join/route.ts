import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || ((session.user as any).role !== 'STUDENT' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { inviteCode } = body

    if (!inviteCode) {
      return NextResponse.json(
        { error: 'Invite code is required' },
        { status: 400 }
      )
    }

    const classroom = await prisma.classroom.findUnique({
      where: { inviteCode: inviteCode.toUpperCase() },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Invalid invite code' },
        { status: 404 }
      )
    }

    const userId = (session.user as any).id

    // Check if already a member
    const existingMember = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: classroom.id,
          userId,
        },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this classroom', classroomId: classroom.id },
        { status: 400 }
      )
    }

    // Add user to classroom
    await prisma.classroomMember.create({
      data: {
        classroomId: classroom.id,
        userId,
      },
    })

    return NextResponse.json({ success: true, classroomId: classroom.id })
  } catch (error) {
    console.error('Error joining classroom:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
