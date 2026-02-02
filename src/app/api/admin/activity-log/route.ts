import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const instructorId = searchParams.get('instructorId')

    // Build where clause
    const where: any = {}
    if (instructorId) {
      where.userId = instructorId
    }

    // Fetch all activities (no date limit) so admins can review old logs
    const activities = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Calculate which logs are older than 90 days
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const activitiesWithAge = activities.map(activity => ({
      ...activity,
      isOld: activity.createdAt < ninetyDaysAgo,
    }))

    // Fetch all instructors for the filter dropdown
    const instructors = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        name: true,
        email: true,
        lastLoginAt: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      activities: activitiesWithAge,
      instructors,
      oldLogsCount: activitiesWithAge.filter(a => a.isOld).length,
    })
  } catch (error: any) {
    console.error('Error fetching activity logs:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
