import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase() ?? ''
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ students: [] })
    }

    const students = await prisma.jeiParentStudent.findMany({
      where: { parentEmail: email },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        age: true,
      },
    })

    return NextResponse.json({ students })
  } catch (e) {
    console.error('[JEI] parent-students GET:', e)
    return NextResponse.json({ error: 'Failed to load saved students.' }, { status: 500 })
  }
}
