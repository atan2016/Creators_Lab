import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cleanupOldLogs } from '@/lib/activity-log'

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const deletedCount = await cleanupOldLogs()

    return NextResponse.json({ deleted: deletedCount })
  } catch (error: any) {
    console.error('Error cleaning up old logs:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
