import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'

async function requireAdmin() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'ADMIN') {
    return null
  }
  return session
}

function generateInviteCode() {
  return randomBytes(4).toString('hex').toUpperCase()
}

/** GET – source classroom + syllabus rows (ordered by date) for the duplicate form */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        syllabusEntries: { orderBy: { date: 'asc' } },
        _count: { select: { resources: true, schedules: true } },
      },
    })

    if (!classroom) {
      return NextResponse.json({ error: 'Classroom not found' }, { status: 404 })
    }

    return NextResponse.json({
      source: {
        id: classroom.id,
        name: classroom.name,
        description: classroom.description,
        googleDriveUrl: classroom.googleDriveUrl,
        syllabus: classroom.syllabusEntries.map((e) => ({
          date: e.date.toISOString(),
          activities: e.activities,
          prework: e.prework,
          lectureInfo: e.lectureInfo,
        })),
        resourceCount: classroom._count.resources,
        scheduleCount: classroom._count.schedules,
      },
    })
  } catch (error) {
    console.error('Duplicate template error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/** POST – create a copy with new name, instructor, and optional syllabus dates */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: sourceId } = await params
    const body = await request.json()
    const { name, creatorId, syllabusDates } = body as {
      name?: string
      creatorId?: string
      syllabusDates?: string[]
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Classroom name is required' }, { status: 400 })
    }
    if (!creatorId || typeof creatorId !== 'string') {
      return NextResponse.json({ error: 'Instructor (creator) is required' }, { status: 400 })
    }

    const instructor = await prisma.user.findUnique({
      where: { id: creatorId },
      select: { id: true, role: true },
    })
    if (!instructor || (instructor.role !== 'TEACHER' && instructor.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Instructor must be a teacher or admin user' },
        { status: 400 }
      )
    }

    const source = await prisma.classroom.findUnique({
      where: { id: sourceId },
      include: {
        syllabusEntries: { orderBy: { date: 'asc' } },
        resources: true,
        schedules: true,
      },
    })

    if (!source) {
      return NextResponse.json({ error: 'Source classroom not found' }, { status: 404 })
    }

    const syllabus = source.syllabusEntries
    if (Array.isArray(syllabusDates) && syllabusDates.length > 0 && syllabusDates.length !== syllabus.length) {
      return NextResponse.json(
        {
          error: `syllabusDates must have ${syllabus.length} entries (one per syllabus row), got ${syllabusDates.length}`,
        },
        { status: 400 }
      )
    }

    let inviteCode = generateInviteCode()
    for (let attempt = 0; attempt < 8; attempt++) {
      const exists = await prisma.classroom.findUnique({
        where: { inviteCode },
        select: { id: true },
      })
      if (!exists) break
      inviteCode = generateInviteCode()
    }

    const newClassroom = await prisma.$transaction(async (tx) => {
      const classroom = await tx.classroom.create({
        data: {
          name: name.trim(),
          description: source.description,
          googleDriveUrl: source.googleDriveUrl,
          inviteCode,
          creatorId,
        },
      })

      for (let i = 0; i < syllabus.length; i++) {
        const row = syllabus[i]
        let date = row.date
        if (Array.isArray(syllabusDates) && syllabusDates.length === syllabus.length) {
          const raw = syllabusDates[i]
          if (raw != null && String(raw).trim() !== '') {
            const parsed = new Date(String(raw))
            if (Number.isNaN(parsed.getTime())) {
              throw new Error(`INVALID_SYLLABUS_DATE:${i + 1}`)
            }
            date = parsed
          }
        }
        await tx.syllabusEntry.create({
          data: {
            classroomId: classroom.id,
            date,
            activities: row.activities,
            prework: row.prework,
            lectureInfo: row.lectureInfo,
          },
        })
      }

      for (const r of source.resources) {
        await tx.resource.create({
          data: {
            classroomId: classroom.id,
            title: r.title,
            description: r.description,
            type: r.type,
            content: r.content,
            githubUrl: r.githubUrl,
            googleDriveUrl: r.googleDriveUrl,
            createdById: r.createdById,
          },
        })
      }

      for (const s of source.schedules) {
        await tx.schedule.create({
          data: {
            classroomId: classroom.id,
            instructorId: creatorId,
            locationId: s.locationId,
            dayOfWeek: s.dayOfWeek,
            startTime: s.startTime,
            endTime: s.endTime,
            isRecurring: s.isRecurring,
            startDate: s.startDate,
            endDate: s.endDate,
          },
        })
      }

      return classroom
    })

    return NextResponse.json(
      {
        classroom: {
          id: newClassroom.id,
          name: newClassroom.name,
          inviteCode: newClassroom.inviteCode,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Duplicate classroom error:', error)
    if (typeof error?.message === 'string' && error.message.startsWith('INVALID_SYLLABUS_DATE:')) {
      const row = error.message.split(':')[1]
      return NextResponse.json(
        { error: `Invalid date for syllabus row ${row}` },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
