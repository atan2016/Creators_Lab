import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logSyllabusActivity, ActivityAction } from '@/lib/activity-log'

// GET - Fetch all syllabus entries for a classroom
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      select: { creatorId: true },
    })

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Check if user is a member of the classroom (for students) or is the creator/admin
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: id,
          userId,
        },
      },
    })

    // Allow viewing if user is creator, admin, or a member of the classroom
    if (classroom.creatorId !== userId && role !== 'ADMIN' && !membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const entries = await prisma.syllabusEntry.findMany({
      where: { classroomId: id },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({ entries })
  } catch (error: any) {
    console.error('Error fetching syllabus:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new syllabus entry
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      select: { creatorId: true, name: true },
    })

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Only teachers or admins can create syllabus entries
    if (role !== 'ADMIN' && role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const body = await request.json()
    const { date, activities, prework, lectureInfo } = body

    if (!date || !activities) {
      return NextResponse.json(
        { error: 'Date and activities are required' },
        { status: 400 }
      )
    }

    // Parse date as local date (not UTC) to avoid timezone issues
    // If date is in YYYY-MM-DD format, append T00:00:00 to treat as local midnight
    const dateString = typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)
      ? `${date}T00:00:00`
      : date
    const parsedDate = new Date(dateString)

    const entry = await prisma.syllabusEntry.create({
      data: {
        classroomId: id,
        date: parsedDate,
        activities,
        prework: prework || null,
        lectureInfo: lectureInfo || null,
      },
    })

    // Log activity if user is a teacher (not admin)
    if (role === 'TEACHER') {
      const dateStr = parsedDate.toISOString().split('T')[0]
      await logSyllabusActivity(userId, ActivityAction.CREATE, entry.id, classroom.name, dateStr)
    }

    return NextResponse.json({ entry }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating syllabus entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
