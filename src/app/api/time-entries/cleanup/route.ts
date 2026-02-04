import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate 90 days ago
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    ninetyDaysAgo.setUTCHours(0, 0, 0, 0)

    // Delete entries older than 90 days (based on date field, not createdAt)
    const { count } = await prisma.timeEntry.deleteMany({
      where: {
        date: {
          lt: ninetyDaysAgo,
        },
      },
    })

    return NextResponse.json({ deleted: count })
  } catch (error: any) {
    console.error('Error purging old time entries:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
