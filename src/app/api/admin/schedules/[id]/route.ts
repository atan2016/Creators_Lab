import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logScheduleActivity, ActivityAction } from '@/lib/activity-log'

// PUT - Update schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    const schedule = await prisma.schedule.findUnique({
      where: { id },
    })

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    // Validate instructor if provided
    if (instructorId) {
      const instructor = await prisma.user.findUnique({
        where: { id: instructorId },
      })

      if (!instructor || instructor.role !== 'TEACHER') {
        return NextResponse.json(
          { error: 'Instructor must be a teacher' },
          { status: 400 }
        )
      }
    }

    // Validate classroom if provided
    if (classroomId) {
      const classroom = await prisma.classroom.findUnique({
        where: { id: classroomId },
      })

      if (!classroom) {
        return NextResponse.json(
          { error: 'Classroom not found' },
          { status: 404 }
        )
      }
    }

    // Validate location if provided
    if (locationId) {
      const location = await prisma.location.findUnique({
        where: { id: locationId },
      })

      if (!location) {
        return NextResponse.json(
          { error: 'Location not found' },
          { status: 404 }
        )
      }
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...(instructorId && { instructorId }),
        ...(classroomId && { classroomId }),
        ...(locationId && { locationId }),
        ...(dayOfWeek !== undefined && { dayOfWeek: isRecurring ? dayOfWeek : null }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(isRecurring !== undefined && { isRecurring }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
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

    // Log activity for the instructor (schedule is updated by admin but for instructor)
    const finalInstructorId = instructorId || schedule.instructorId
    const finalClassroomName = updatedSchedule.classroom.name
    const finalLocationName = updatedSchedule.location.name
    const finalStartTime = startTime ? new Date(startTime) : schedule.startTime
    const timeStr = finalStartTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    await logScheduleActivity(
      finalInstructorId,
      ActivityAction.UPDATE,
      id,
      finalClassroomName,
      finalLocationName,
      timeStr
    )

    return NextResponse.json({ schedule: updatedSchedule })
  } catch (error: any) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
          },
        },
        classroom: {
          select: {
            name: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })
    }

    const timeStr = schedule.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    await prisma.schedule.delete({
      where: { id },
    })

    // Log activity for the instructor (schedule is deleted by admin but was for instructor)
    await logScheduleActivity(
      schedule.instructorId,
      ActivityAction.DELETE,
      id,
      schedule.classroom.name,
      schedule.location.name,
      timeStr
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
