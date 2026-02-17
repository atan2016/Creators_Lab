import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    // Get the user to be deleted
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    })

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deleting yourself
    if (id === userId) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }

    // Authorization checks
    if (userRole === 'ADMIN') {
      // Admins can delete any user
    } else if (userRole === 'TEACHER') {
      // Teachers can only delete students
      if (userToDelete.role !== 'STUDENT') {
        return NextResponse.json(
          { error: 'Teachers can only delete students' },
          { status: 403 }
        )
      }
    } else {
      // Students cannot delete anyone
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Delete the user (cascade will handle related records)
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
