import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { detectConflicts } from '@/lib/schedule-conflicts'

// GET - Detect conflicts for a given date range
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause for date filtering
    const where: any = {}

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

    // Fetch all schedules with related data
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
    })

    // Transform to format expected by conflict detection
    const schedulesForDetection = schedules.map((s) => ({
      id: s.id,
      instructorId: s.instructorId,
      instructorName: s.instructor.name,
      classroomId: s.classroomId,
      classroomName: s.classroom.name,
      locationId: s.locationId,
      locationName: s.location.name,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isRecurring: s.isRecurring,
      startDate: s.startDate,
      endDate: s.endDate,
    }))

    // Detect conflicts
    const conflicts = detectConflicts(schedulesForDetection)

    return NextResponse.json({ conflicts })
  } catch (error: any) {
    console.error('Error detecting conflicts:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
