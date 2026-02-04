import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to count words
function countWords(text: string | null | undefined): number {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Only teachers and admins can access time entries
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get('instructorId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause
    const where: any = {}

    // If user is TEACHER, only show their own entries
    if (role === 'TEACHER') {
      where.instructorId = userId
    } else if (role === 'ADMIN' && instructorId) {
      // Admin can filter by instructor
      where.instructorId = instructorId
    }

    // Date filtering
    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        const start = new Date(startDate)
        start.setUTCHours(0, 0, 0, 0)
        where.date.gte = start
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setUTCHours(23, 59, 59, 999)
        where.date.lte = end
      }
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    // Calculate 90 days ago
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    // Mark old entries and count them
    let oldEntriesCount = 0
    const timeEntriesWithOldFlag = timeEntries.map(entry => {
      const entryDate = new Date(entry.date)
      const isOld = entryDate < ninetyDaysAgo
      if (isOld) {
        oldEntriesCount++
      }
      return { ...entry, isOld }
    })

    return NextResponse.json({ 
      timeEntries: timeEntriesWithOldFlag,
      oldEntriesCount 
    })
  } catch (error: any) {
    console.error('Error fetching time entries:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Only teachers can create time entries
    if (role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden. Only instructors can create time entries.' }, { status: 403 })
    }

    const body = await request.json()
    const { date, hours, category, description } = body

    // Validation
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    if (!hours || typeof hours !== 'number' || hours <= 0) {
      return NextResponse.json({ error: 'Hours must be a positive number' }, { status: 400 })
    }

    if (!category || !['IN_CLASS_TEACHING', 'LESSON_PLANNING', 'MEETINGS', 'OTHER'].includes(category)) {
      return NextResponse.json({ error: 'Category is required and must be one of: IN_CLASS_TEACHING, LESSON_PLANNING, MEETINGS, OTHER' }, { status: 400 })
    }

    // Validate description word count
    if (description && countWords(description) > 200) {
      return NextResponse.json({ 
        error: `Description must be less than 200 words (currently ${countWords(description)} words)` 
      }, { status: 400 })
    }

    // Parse date
    const entryDate = new Date(date)
    entryDate.setUTCHours(0, 0, 0, 0)

    const timeEntry = await prisma.timeEntry.create({
      data: {
        instructorId: userId,
        date: entryDate,
        hours: hours,
        category: category,
        description: description || null,
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

    return NextResponse.json({ timeEntry }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating time entry:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
