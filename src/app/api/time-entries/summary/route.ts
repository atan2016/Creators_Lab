import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Only teachers and admins can access summaries
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

    // Get all time entries for calculations
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
      orderBy: { date: 'asc' },
    })

    // Calculate statistics
    const totalHours = timeEntries.reduce((sum, entry) => {
      return sum + Number(entry.hours)
    }, 0)

    const entriesCount = timeEntries.length
    const averageHours = entriesCount > 0 ? totalHours / entriesCount : 0

    // Breakdown by instructor (for admin view when viewing all)
    const breakdownByInstructor: Record<string, { hours: number; entries: number; name: string }> = {}
    if (role === 'ADMIN' && !instructorId) {
      timeEntries.forEach(entry => {
        const instructorId = entry.instructorId
        if (!breakdownByInstructor[instructorId]) {
          breakdownByInstructor[instructorId] = {
            hours: 0,
            entries: 0,
            name: entry.instructor.name,
          }
        }
        breakdownByInstructor[instructorId].hours += Number(entry.hours)
        breakdownByInstructor[instructorId].entries += 1
      })
    }

    // Breakdown by month
    const breakdownByMonth: Record<string, { hours: number; entries: number }> = {}
    timeEntries.forEach(entry => {
      const monthKey = entry.date.toISOString().substring(0, 7) // YYYY-MM
      if (!breakdownByMonth[monthKey]) {
        breakdownByMonth[monthKey] = { hours: 0, entries: 0 }
      }
      breakdownByMonth[monthKey].hours += Number(entry.hours)
      breakdownByMonth[monthKey].entries += 1
    })

    // Breakdown by week
    const breakdownByWeek: Record<string, { hours: number; entries: number }> = {}
    timeEntries.forEach(entry => {
      const date = new Date(entry.date)
      const year = date.getFullYear()
      const week = getWeekNumber(date)
      const weekKey = `${year}-W${week.toString().padStart(2, '0')}`
      if (!breakdownByWeek[weekKey]) {
        breakdownByWeek[weekKey] = { hours: 0, entries: 0 }
      }
      breakdownByWeek[weekKey].hours += Number(entry.hours)
      breakdownByWeek[weekKey].entries += 1
    })

    return NextResponse.json({
      summary: {
        totalHours: Number(totalHours.toFixed(2)),
        entriesCount,
        averageHours: Number(averageHours.toFixed(2)),
      },
      breakdownByInstructor: role === 'ADMIN' && !instructorId ? breakdownByInstructor : undefined,
      breakdownByMonth,
      breakdownByWeek,
    })
  } catch (error: any) {
    console.error('Error fetching time entry summary:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}
