import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update a syllabus entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, entryId } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      select: { creatorId: true },
    })

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Only teacher/creator or admin can update syllabus entries
    if (classroom.creatorId !== userId && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const entry = await prisma.syllabusEntry.findUnique({
      where: { id: entryId },
    })

    if (!entry || entry.classroomId !== id) {
      return NextResponse.json({ error: 'Syllabus entry not found' }, { status: 404 })
    }

    const body = await request.json()
    const { date, activities, prework, lectureInfo } = body

    if (!date || !activities) {
      return NextResponse.json(
        { error: 'Date and activities are required' },
        { status: 400 }
      )
    }

    const updatedEntry = await prisma.syllabusEntry.update({
      where: { id: entryId },
      data: {
        date: new Date(date),
        activities,
        prework: prework || null,
        lectureInfo: lectureInfo || null,
      },
    })

    return NextResponse.json({ entry: updatedEntry })
  } catch (error: any) {
    console.error('Error updating syllabus entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a syllabus entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, entryId } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      select: { creatorId: true },
    })

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Only teacher/creator or admin can delete syllabus entries
    if (classroom.creatorId !== userId && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const entry = await prisma.syllabusEntry.findUnique({
      where: { id: entryId },
    })

    if (!entry || entry.classroomId !== id) {
      return NextResponse.json({ error: 'Syllabus entry not found' }, { status: 404 })
    }

    await prisma.syllabusEntry.delete({
      where: { id: entryId },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting syllabus entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
