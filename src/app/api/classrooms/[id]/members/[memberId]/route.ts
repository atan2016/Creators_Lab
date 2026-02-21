import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - Remove a member from a classroom (admin only for teachers)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await auth()
    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: classroomId, memberId } = await params

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      include: {
        members: {
          include: {
            user: { select: { id: true, role: true } },
          },
        },
      },
    })

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }

    const member = classroom.members.find((m) => m.id === memberId)
    if (!member) {
      return NextResponse.json({ error: 'Member not found in this classroom' }, { status: 404 })
    }

    const role = (session.user as any).role
    const isAdmin = role === 'ADMIN'
    const isCreator = classroom.creatorId === (session.user as any).id

    // Only admins can remove teachers; creator or admin can remove students
    if (member.user.role === 'TEACHER') {
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Only admins can remove teachers from a classroom' },
          { status: 403 }
        )
      }
    } else {
      // Removing a student - creator or admin
      if (!isCreator && !isAdmin) {
        return NextResponse.json(
          { error: 'Only the classroom creator or admin can remove members' },
          { status: 403 }
        )
      }
    }

    await prisma.classroomMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing member from classroom:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
