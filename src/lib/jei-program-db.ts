import { prisma } from '@/lib/prisma'
import { JEI_PROGRAMS } from '@/lib/jei-programs'

/** Upsert all JEI programs from seed so DB rows exist for registration. */
export async function ensureJeiProgramsSeeded() {
  for (const program of JEI_PROGRAMS) {
    await prisma.jeiProgram.upsert({
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
