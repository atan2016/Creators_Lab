import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to count words
function countWords(text: string | null | undefined): number {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    const { id } = await params

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!timeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 })
    }

    // Check permissions: teacher can only see their own, admin can see all
    if (role === 'TEACHER' && timeEntry.instructorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ timeEntry })
  } catch (error: any) {
    console.error('Error fetching time entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    const { id } = await params

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!timeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 })
    }

    // Check permissions: teacher can only update their own, admin can update all
    if (role === 'TEACHER' && timeEntry.instructorId !== userId) {
      return NextResponse.json({ error: 'Forbidden. You can only update your own time entries.' }, { status: 403 })
    }

    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { date, hours, category, description } = body

    // Validation
    if (date !== undefined) {
      const entryDate = new Date(date)
      entryDate.setUTCHours(0, 0, 0, 0)
      body.date = entryDate
    }

    if (hours !== undefined && (typeof hours !== 'number' || hours <= 0)) {
      return NextResponse.json({ error: 'Hours must be a positive number' }, { status: 400 })
    }

    if (category !== undefined && !['IN_CLASS_TEACHING', 'LESSON_PLANNING', 'MEETINGS', 'OTHER'].includes(category)) {
      return NextResponse.json({ error: 'Category must be one of: IN_CLASS_TEACHING, LESSON_PLANNING, MEETINGS, OTHER' }, { status: 400 })
    }

    // Validate description word count
    if (description !== undefined && description && countWords(description) > 200) {
      return NextResponse.json({ 
        error: `Description must be less than 200 words (currently ${countWords(description)} words)` 
      }, { status: 400 })
    }

    const updatedTimeEntry = await prisma.timeEntry.update({
      where: { id },
      data: {
        ...(date !== undefined && { date: body.date }),
        ...(hours !== undefined && { hours }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description: description || null }),
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ timeEntry: updatedTimeEntry })
  } catch (error: any) {
    console.error('Error updating time entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    const { id } = await params

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
    })

    if (!timeEntry) {
      return NextResponse.json({ error: 'Time entry not found' }, { status: 404 })
    }

    // Check permissions: teacher can only delete their own, admin can delete all
    if (role === 'TEACHER' && timeEntry.instructorId !== userId) {
      return NextResponse.json({ error: 'Forbidden. You can only delete your own time entries.' }, { status: 403 })
    }

    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.timeEntry.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting time entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
