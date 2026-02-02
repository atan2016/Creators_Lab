import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logScheduleActivity, ActivityAction } from '@/lib/activity-log'

// GET - List schedules with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get('instructorId')
    const locationId = searchParams.get('locationId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const userId = (session.user as any).id
    const role = (session.user as any).role

    // Build where clause
    const where: any = {}

    // If user is TEACHER, only show their own schedules
    if (role === 'TEACHER') {
      where.instructorId = userId
    } else if (instructorId) {
      // Admin can filter by any instructor
      where.instructorId = instructorId
    }

    if (locationId) {
      where.locationId = locationId
    }

    // Date filtering - only apply if dates are provided
    // If no date filters, return all schedules (filtered by instructor/location only)
    if (startDate || endDate) {
      const dateFilterStart = startDate ? new Date(startDate) : null
      const dateFilterEnd = endDate ? new Date(endDate + 'T23:59:59.999Z') : null
      
      where.OR = [
        // One-time schedules: must fall within the date range
        {
          isRecurring: false,
          ...(dateFilterStart && { startTime: { gte: dateFilterStart } }),
          ...(dateFilterEnd && { endTime: { lte: dateFilterEnd } }),
        },
        // Recurring schedules: check if schedule's date range overlaps with filter date range
        {
          isRecurring: true,
          AND: [
            // Schedule starts before or on the filter end date (or has no start date)
            {
              OR: [
                { startDate: null },
                ...(dateFilterEnd ? [{ startDate: { lte: dateFilterEnd } }] : [{}]),
              ],
            },
            // Schedule ends after or on the filter start date (or has no end date)
            {
              OR: [
                { endDate: null },
                ...(dateFilterStart ? [{ endDate: { gte: dateFilterStart } }] : [{}]),
              ],
            },
          ],
        },
      ]
    }

    console.log('Fetching schedules with filters:', { where, startDate, endDate, instructorId, locationId })
    
    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
      orderBy: [
        { startTime: 'asc' },
        { dayOfWeek: 'asc' },
      ],
    })

    console.log(`Found ${schedules.length} schedules`)
    return NextResponse.json({ schedules })
  } catch (error: any) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create schedule (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      instructorId,
      classroomId,
      locationId,
      dayOfWeek,
      startTime,
      endTime,
      isRecurring,
      startDate,
      endDate,
    } = body

    if (!instructorId || !classroomId || !locationId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Required fields: instructorId, classroomId, locationId, startTime, endTime' },
        { status: 400 }
      )
    }

    // Validate instructor is a teacher
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
    })

    if (!instructor || instructor.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Instructor must be a teacher' },
        { status: 400 }
      )
    }

    // Validate classroom exists
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    // Validate location exists
    const location = await prisma.location.findUnique({
      where: { id: locationId },
    })

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // Validate recurring schedule has startDate and endDate
    if (isRecurring && (!startDate || !endDate)) {
      return NextResponse.json(
        { error: 'Recurring schedules must have a start date and end date' },
        { status: 400 }
      )
    }
    
    // For weekly recurring schedules, dayOfWeek is required
    // For daily recurring schedules, dayOfWeek should be null
    // If dayOfWeek is provided, it's weekly; if null/undefined, it's daily

    const schedule = await prisma.schedule.create({
      data: {
        instructorId,
        classroomId,
        locationId,
        dayOfWeek: isRecurring ? dayOfWeek : null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isRecurring: isRecurring || false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        classroom: {
          select: {
            id: true,
            name: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
          },
        },
      },
    })

    // Log activity for the instructor (schedule is created by admin but for instructor)
    const timeStr = new Date(startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    await logScheduleActivity(
      instructorId,
      ActivityAction.CREATE,
      schedule.id,
      classroom.name,
      location.name,
      timeStr
    )

    return NextResponse.json({ schedule }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
