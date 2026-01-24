import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get all available Google Drive links for teachers
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session || ((session.user as any).role !== 'TEACHER' && (session.user as any).role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await prisma.googleDriveLink.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        driveUrl: true,
        description: true,
      },
    })

    return NextResponse.json({ links })
  } catch (error: any) {
    console.error('Error fetching Google Drive links:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
