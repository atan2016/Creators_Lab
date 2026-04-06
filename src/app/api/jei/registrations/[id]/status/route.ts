import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ALLOWED = new Set([
  'PENDING_REVIEW',
  'INVOICED',
  'PAID',
  'CANCELLED_REFUNDED',
  'CANCELLED_CREDITED',
])

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const { status, notes } = await request.json()
    if (!ALLOWED.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const db: any = prisma as any
    const updated = await db.jeiRegistration.update({
      where: { id },
      data: {
        status,
        notes: notes || null,
        reviewedById: (session.user as any).id,
        reviewedAt: new Date(),
        paidAt: status === 'PAID' ? new Date() : null,
      },
    })

    return NextResponse.json({ registration: updated })
  } catch (error) {
    console.error('Error updating JEI registration status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
