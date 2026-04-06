import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { JEI_PROGRAMS, formatProgramOptionLabel } from '@/lib/jei-programs'

async function ensureProgramsSeeded() {
  const db: any = prisma as any
  for (const program of JEI_PROGRAMS) {
    await db.jeiProgram.upsert({
      where: { slug: program.slug },
      create: {
        slug: program.slug,
        name: program.name,
        dateLabel: program.dateLabel,
        startDate: new Date(program.startDate),
        endDate: new Date(program.endDate),
        weeklyPrice: program.weeklyPrice,
        isActive: true,
      },
      update: {
        name: program.name,
        dateLabel: program.dateLabel,
        startDate: new Date(program.startDate),
        endDate: new Date(program.endDate),
        weeklyPrice: program.weeklyPrice,
        isActive: true,
      },
    })
  }
}

export async function GET() {
  try {
    const db: any = prisma as any
    await ensureProgramsSeeded()

    const programs = await db.jeiProgram.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({
      programs: programs.map((p: any) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        dateLabel: p.dateLabel,
        weeklyPrice: p.weeklyPrice,
        startDate: p.startDate,
        endDate: p.endDate,
        optionLabel: formatProgramOptionLabel(p),
      })),
    })
  } catch (error) {
    console.error('Error fetching JEI programs:', error)
    return NextResponse.json({ error: 'Failed to fetch JEI programs' }, { status: 500 })
  }
}
