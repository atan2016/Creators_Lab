import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Date filtering for one-time schedules
    if (startDate || endDate) {
      where.OR = [
        // One-time schedules within date range
        {
          isRecurring: false,
          ...(startDate && { startTime: { gte: new Date(startDate) } }),
          ...(endDate && { endTime: { lte: new Date(endDate) } }),
        },
        // Recurring schedules that overlap with date range
        {
          isRecurring: true,
          OR: [
            { startDate: null }, // No end date restriction
            {
              startDate: { lte: endDate || new Date() },
              endDate: { gte: startDate || new Date(0) },
            },
          ],
        },
      ]
    }

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

    // Validate recurring schedule has dayOfWeek
    if (isRecurring && (dayOfWeek === null || dayOfWeek === undefined)) {
      return NextResponse.json(
        { error: 'Recurring schedules must have a dayOfWeek (0-6)' },
        { status: 400 }
      )
    }

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

    return NextResponse.json({ schedule }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
