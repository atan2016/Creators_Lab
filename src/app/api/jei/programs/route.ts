import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureJeiProgramsSeeded } from '@/lib/jei-program-db'
import { JEI_PROGRAMS, formatProgramOptionLabel, getStripeUrlForJeiSlug } from '@/lib/jei-programs'

function staticProgramsPayload() {
  return {
    programSelection: 'slug' as const,
    programs: JEI_PROGRAMS.map((p) => ({
      slug: p.slug,
      name: p.name,
      dateLabel: p.dateLabel,
      weeklyPrice: p.weeklyPrice,
      startDate: p.startDate,
      endDate: p.endDate,
      optionLabel: formatProgramOptionLabel(p),
      stripeUrl: getStripeUrlForJeiSlug(p.slug) ?? p.stripeUrl,
    })),
  }
}

export async function GET() {
  try {
    await ensureJeiProgramsSeeded()

    const programs = await prisma.jeiProgram.findMany({
      where: { isActive: true },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({
      programSelection: 'id' as const,
      programs: programs.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        dateLabel: p.dateLabel,
        weeklyPrice: p.weeklyPrice,
        startDate: p.startDate,
        endDate: p.endDate,
        optionLabel: formatProgramOptionLabel(p),
        stripeUrl: getStripeUrlForJeiSlug(p.slug),
      })),
    })
  } catch (error) {
    console.error('Error fetching JEI programs:', error)
    // Still return 200 with catalog from code so the registration page works when DB is unavailable.
    return NextResponse.json({
      ...staticProgramsPayload(),
      usedStaticFallback: true,
    })
  }
}
