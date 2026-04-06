import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import {
  notifyJeiAdminNewRegistration,
  sendJeiRegistrationBatchConfirmationEmail,
  sendJeiRegistrationConfirmationEmail,
} from '@/lib/jei-email'
import { ensureJeiProgramsSeeded } from '@/lib/jei-program-db'
import { buildJeiRegistrationPayUrl } from '@/lib/jei-site'

const MIN_STUDENT_AGE = 5
const MAX_STUDENT_AGE = 18

type StudentNamePayload = {
  firstName?: string
  lastName?: string
  /** Integer age; required for new students or when overriding a saved profile. */
  age?: number
  /** Saved child profile id (must belong to parentEmail). */
  savedStudentId?: string
}

function normalizeStudentAge(raw: unknown): number | null | 'invalid' {
  if (raw === undefined || raw === null) return null
  const n = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isInteger(n) || n < MIN_STUDENT_AGE || n > MAX_STUDENT_AGE) return 'invalid'
  return n
}

type ProgramGroupPayload = {
  programSlug: string
  students: StudentNamePayload[]
}

type RegisterPayload = {
  parentFirstName?: string
  parentLastName?: string
  parentName?: string
  parentEmail: string
  parentPhone: string
  emergencyPhone: string
  authorizedPickupName: string
  authorizedPickupPhone: string
  authorizedPickupRelation?: string
  /** Multiple programs, each with its own student list. */
  programGroups?: ProgramGroupPayload[]
  students?: StudentNamePayload[]
  studentNames?: string[]
  selectedProgramId?: string
  selectedProgramSlug?: string
  updatesOnly?: boolean
}

type ResolvedStudentRow = { name: string; age: number }

type ProfileSyncOp =
  | { kind: 'create'; firstName: string; lastName: string; age: number }
  | { kind: 'update'; id: string; age: number }

function mergeProfileSyncOps(ops: ProfileSyncOp[]): ProfileSyncOp[] {
  const updates = new Map<string, ProfileSyncOp>()
  const creates = new Map<string, ProfileSyncOp>()
  for (const op of ops) {
    if (op.kind === 'update') {
      updates.set(op.id, op)
    } else {
      const k = `${op.firstName.trim().toLowerCase()}|${op.lastName.trim().toLowerCase()}`
      creates.set(k, op)
    }
  }
  return [...updates.values(), ...creates.values()]
}

async function applyJeiParentStudentSync(parentEmailNorm: string, ops: ProfileSyncOp[]) {
  const merged = mergeProfileSyncOps(ops)
  for (const op of merged) {
    if (op.kind === 'update') {
      await prisma.jeiParentStudent.update({
        where: { id: op.id },
        data: { age: op.age },
      })
    } else {
      const existing = await prisma.jeiParentStudent.findFirst({
        where: {
          parentEmail: parentEmailNorm,
          firstName: op.firstName,
          lastName: op.lastName,
        },
      })
      if (existing) {
        await prisma.jeiParentStudent.update({
          where: { id: existing.id },
          data: { age: op.age },
        })
      } else {
        await prisma.jeiParentStudent.create({
          data: {
            parentEmail: parentEmailNorm,
            firstName: op.firstName,
            lastName: op.lastName,
            age: op.age,
          },
        })
      }
    }
  }
}

async function resolveStudentList(
  parentEmailNorm: string,
  students: StudentNamePayload[] | undefined
): Promise<{ rows: ResolvedStudentRow[]; profileSync: ProfileSyncOp[]; error?: string }> {
  if (!students?.length) return { rows: [], profileSync: [] }
  const rows: ResolvedStudentRow[] = []
  const profileSync: ProfileSyncOp[] = []

  for (const s of students) {
    const sid = typeof s.savedStudentId === 'string' ? s.savedStudentId.trim() : ''
    if (sid) {
      const p = await prisma.jeiParentStudent.findFirst({
        where: { id: sid, parentEmail: parentEmailNorm },
      })
      if (!p) {
        return {
          rows: [],
          profileSync: [],
          error:
            'A selected saved student is not valid for this email. Refresh the page, check your email address, and try again.',
        }
      }
      let ageNorm: number | null = null
      if (s.age !== undefined && s.age !== null) {
        const c = normalizeStudentAge(s.age)
        if (c === 'invalid') {
          return {
            rows: [],
            profileSync: [],
            error: `Select a valid age (${MIN_STUDENT_AGE}–${MAX_STUDENT_AGE}) for ${p.firstName} ${p.lastName}.`,
          }
        }
        if (c !== null) ageNorm = c
      }
      if (ageNorm === null) {
        const d = normalizeStudentAge(p.age)
        if (d === null || d === 'invalid') {
          return {
            rows: [],
            profileSync: [],
            error: `Select a valid age (${MIN_STUDENT_AGE}–${MAX_STUDENT_AGE}) for ${p.firstName} ${p.lastName}.`,
          }
        }
        ageNorm = d
      }
      rows.push({ name: `${p.firstName} ${p.lastName}`.trim(), age: ageNorm })
      if (p.age !== ageNorm) {
        profileSync.push({ kind: 'update', id: sid, age: ageNorm })
      }
      continue
    }

    const f = s.firstName?.trim() ?? ''
    const l = s.lastName?.trim() ?? ''
    if (!f && !l) continue
    if (!f || !l) {
      return { rows: [], profileSync: [], error: 'Each new student must have both first name and last name.' }
    }
    const ageNorm = normalizeStudentAge(s.age)
    if (ageNorm === null || ageNorm === 'invalid') {
      return {
        rows: [],
        profileSync: [],
        error: `Each student must have a valid age (${MIN_STUDENT_AGE}–${MAX_STUDENT_AGE}).`,
      }
    }
    rows.push({ name: `${f} ${l}`.trim(), age: ageNorm })
    profileSync.push({ kind: 'create', firstName: f, lastName: l, age: ageNorm })
  }

  return { rows, profileSync }
}

async function resolveProgramGroupsFromPayload(
  parentEmailNorm: string,
  raw: ProgramGroupPayload[] | undefined
): Promise<{
  groups: { slug: string; students: ResolvedStudentRow[] }[]
  profileSync: ProfileSyncOp[]
  error?: string
}> {
  if (!raw?.length) return { groups: [], profileSync: [] }
  const groups: { slug: string; students: ResolvedStudentRow[] }[] = []
  const profileSync: ProfileSyncOp[] = []

  for (const g of raw) {
    const slug = g.programSlug?.trim() ?? ''
    if (!slug) {
      return { groups: [], profileSync: [], error: 'Each program row must have a program selected.' }
    }
    const { rows, profileSync: ps, error } = await resolveStudentList(parentEmailNorm, g.students)
    if (error) return { groups: [], profileSync: [], error }
    if (rows.length === 0) {
      return {
        groups: [],
        profileSync: [],
        error:
          'Add at least one student for every program you select (choose a saved child or add new), or remove that program row.',
      }
    }
    groups.push({ slug, students: rows })
    profileSync.push(...ps)
  }

  return { groups, profileSync }
}

async function resolveLegacyStudentsAsync(
  parentEmailNorm: string,
  payload: RegisterPayload
): Promise<{
  students: { name: string; age: number | null }[]
  profileSync: ProfileSyncOp[]
  error?: string
}> {
  if (payload.students !== undefined && payload.students.length > 0) {
    const { rows, profileSync, error } = await resolveStudentList(parentEmailNorm, payload.students)
    if (error) return { students: [], profileSync: [], error }
    return {
      students: rows.map((r) => ({ name: r.name, age: r.age })),
      profileSync,
    }
  }
  const legacy = (payload.studentNames || []).map((n) => n.trim()).filter(Boolean)
  return {
    students: legacy.map((name) => ({ name, age: null as number | null })),
    profileSync: [],
  }
}

export async function POST(request: NextRequest) {
  try {
    let payload: RegisterPayload
    try {
      payload = (await request.json()) as RegisterPayload
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const parentFirst = payload.parentFirstName?.trim() ?? ''
    const parentLast = payload.parentLastName?.trim() ?? ''
    const parentLegacy = payload.parentName?.trim() ?? ''
    const parentName =
      parentFirst && parentLast ? `${parentFirst} ${parentLast}`.trim() : parentLegacy || null

    const parentEmail = payload.parentEmail?.trim().toLowerCase()
    const parentPhone = payload.parentPhone?.trim()
    const emergencyPhone = payload.emergencyPhone?.trim()
    const updatesOnly = Boolean(payload.updatesOnly)

    if ((!parentFirst || !parentLast) && !parentLegacy) {
      return NextResponse.json({ error: 'Parent first and last name are required.' }, { status: 400 })
    }

    if (!parentName || !parentEmail || !parentPhone || !emergencyPhone) {
      return NextResponse.json({ error: 'Parent and contact fields are required.' }, { status: 400 })
    }

    if (updatesOnly) {
      await prisma.updatesSubscriber.upsert({
        where: { email: parentEmail },
        create: { parentName, email: parentEmail },
        update: { parentName, optedInAt: new Date() },
      })

      return NextResponse.json({
        ok: true,
        updatesOnly: true,
        message: 'You are subscribed for program updates.',
      })
    }

    const pickupName = payload.authorizedPickupName?.trim()
    const pickupPhone = payload.authorizedPickupPhone?.trim()
    const pickupRelation = payload.authorizedPickupRelation?.trim() || null
    const hasPickup = Boolean(pickupName && pickupPhone)
    if ((pickupName && !pickupPhone) || (!pickupName && pickupPhone)) {
      return NextResponse.json(
        { error: 'Other authorized pickup requires both name and phone, or leave both blank.' },
        { status: 400 }
      )
    }

    const pickupCreate = hasPickup
      ? {
          name: pickupName!,
          phone: pickupPhone!,
          relation: pickupRelation,
        }
      : undefined

    const policySnapshot =
      'Full refunds are available up to 30 days before program start (minus 3% processing fee). Within 30 days, cancellation is credit-only. Credit expires in 1 year.'

    const parentEmailNorm = parentEmail.trim().toLowerCase()
    const hasRawProgramGroups = Boolean(payload.programGroups && payload.programGroups.length > 0)

    let programGroups: { slug: string; students: ResolvedStudentRow[] }[] = []
    let batchProfileSync: ProfileSyncOp[] = []

    if (hasRawProgramGroups) {
      const resolved = await resolveProgramGroupsFromPayload(parentEmailNorm, payload.programGroups)
      if (resolved.error) {
        return NextResponse.json({ error: resolved.error }, { status: 400 })
      }
      programGroups = resolved.groups
      batchProfileSync = resolved.profileSync
    }

    const hasProgramGroups = programGroups.length > 0

    if (hasProgramGroups) {
      await ensureJeiProgramsSeeded()

      for (const g of programGroups) {
        const p = await prisma.jeiProgram.findUnique({ where: { slug: g.slug } })
        if (!p || !p.isActive) {
          return NextResponse.json({ error: `Selected program is not available (${g.slug}).` }, { status: 400 })
        }
      }

      const results = await prisma.$transaction(async (tx) => {
        const out: {
          registrationId: string
          programSlug: string
          programName: string | null
          studentCount: number
          totalAmountCents: number
          paymentUrl: string
        }[] = []

        for (const g of programGroups) {
          const program = await tx.jeiProgram.findUnique({ where: { slug: g.slug } })
          if (!program || !program.isActive) {
            throw new Error('PROGRAM_UNAVAILABLE')
          }
          const totalAmountCents = g.students.length * program.weeklyPrice * 100
          const registration = await tx.jeiRegistration.create({
            data: {
              parentName,
              parentEmail,
              parentPhone,
              emergencyPhone,
              selectedProgramId: program.id,
              selectedProgramName: program.name,
              selectedProgramPrice: program.weeklyPrice,
              selectedProgramDates: program.dateLabel,
              studentCount: g.students.length,
              totalAmountCents,
              status: 'PENDING_REVIEW',
              updatesOnly: false,
              policySnapshot,
              students: {
                create: g.students.map((row) => ({ name: row.name, age: row.age })),
              },
              ...(pickupCreate
                ? {
                    authorizedPickup: {
                      create: pickupCreate,
                    },
                  }
                : {}),
            },
          })
          out.push({
            registrationId: registration.id,
            programSlug: program.slug,
            programName: registration.selectedProgramName,
            studentCount: registration.studentCount,
            totalAmountCents: registration.totalAmountCents,
            paymentUrl: buildJeiRegistrationPayUrl(registration.id),
          })
        }
        return out
      })

      const grandTotalCents = results.reduce((s, r) => s + r.totalAmountCents, 0)

      try {
        await applyJeiParentStudentSync(parentEmailNorm, batchProfileSync)
      } catch (syncErr) {
        console.error('[JEI] JeiParentStudent sync failed after registration (data is saved):', syncErr)
      }

      await notifyJeiAdminNewRegistration({
        parentName: parentName!,
        parentEmail,
        parentPhone,
        items: results.map((r, i) => ({
          programName: r.programName ?? r.programSlug,
          studentCount: r.studentCount,
          registrationId: r.registrationId,
          studentSummaries: programGroups[i].students.map((s) => `${s.name} (age ${s.age})`),
        })),
      })

      let parentEmailNote = ''
      try {
        await sendJeiRegistrationBatchConfirmationEmail({
          to: parentEmail,
          parentName,
          items: results.map((r) => ({
            registrationId: r.registrationId,
            programName: r.programName ?? r.programSlug,
            studentCount: r.studentCount,
            totalAmountCents: r.totalAmountCents,
            paymentUrl: r.paymentUrl,
          })),
          grandTotalCents,
        })
      } catch (emailErr) {
        console.error('[JEI] Parent batch confirmation email failed (registration was saved):', emailErr)
        parentEmailNote =
          ' We could not send the confirmation email—check spam or contact info@creators-lab.org if you need a copy.'
      }

      return NextResponse.json({
        ok: true,
        programGroups: results.map((r) => ({
          registrationId: r.registrationId,
          programSlug: r.programSlug,
          programName: r.programName,
          studentCount: r.studentCount,
          totalAmountCents: r.totalAmountCents,
          paymentUrl: r.paymentUrl,
          stripeUrl: r.paymentUrl,
        })),
        grandTotalCents,
        message:
          'Registration saved for all selected programs. Use each Stripe link below (and your confirmation email) to pay and secure each spot.' +
          parentEmailNote,
      })
    }

    // --- Legacy: single program + flat students ---
    const slug = payload.selectedProgramSlug?.trim()
    const hasId = Boolean(payload.selectedProgramId?.trim())
    if (!hasId && !slug) {
      return NextResponse.json(
        { error: 'Add at least one program with students, or select a single program (legacy).' },
        { status: 400 }
      )
    }

    const {
      students: legacyStudentRows,
      profileSync: legacyProfileSync,
      error: legacyStudentError,
    } = await resolveLegacyStudentsAsync(parentEmailNorm, payload)
    if (legacyStudentError) {
      return NextResponse.json({ error: legacyStudentError }, { status: 400 })
    }
    if (legacyStudentRows.length === 0) {
      return NextResponse.json({ error: 'Add at least one student with first and last name.' }, { status: 400 })
    }

    await ensureJeiProgramsSeeded()

    let program =
      hasId
        ? await prisma.jeiProgram.findUnique({ where: { id: payload.selectedProgramId!.trim() } })
        : null
    if (!program && slug) {
      program = await prisma.jeiProgram.findUnique({ where: { slug } })
    }
    if (!program || !program.isActive) {
      return NextResponse.json({ error: 'Selected program is not available.' }, { status: 400 })
    }

    const totalAmountCents = legacyStudentRows.length * program.weeklyPrice * 100

    const registration = await prisma.jeiRegistration.create({
      data: {
        parentName,
        parentEmail,
        parentPhone,
        emergencyPhone,
        selectedProgramId: program.id,
        selectedProgramName: program.name,
        selectedProgramPrice: program.weeklyPrice,
        selectedProgramDates: program.dateLabel,
        studentCount: legacyStudentRows.length,
        totalAmountCents,
        status: 'PENDING_REVIEW',
        updatesOnly: false,
        policySnapshot,
        students: {
          create: legacyStudentRows.map((row) => ({ name: row.name, age: row.age })),
        },
        ...(pickupCreate
          ? {
              authorizedPickup: {
                create: pickupCreate,
              },
            }
          : {}),
      },
      include: { students: true },
    })

    const paymentUrl = buildJeiRegistrationPayUrl(registration.id)

    try {
      await applyJeiParentStudentSync(parentEmailNorm, legacyProfileSync)
    } catch (syncErr) {
      console.error('[JEI] JeiParentStudent sync failed after registration (data is saved):', syncErr)
    }

    await notifyJeiAdminNewRegistration({
      parentName: parentName!,
      parentEmail,
      parentPhone,
      items: [
        {
          programName: registration.selectedProgramName ?? program.name,
          studentCount: registration.studentCount,
          registrationId: registration.id,
          studentSummaries: legacyStudentRows.map((row) =>
            row.age != null ? `${row.name} (age ${row.age})` : row.name
          ),
        },
      ],
    })

    let parentEmailNote = ''
    try {
      await sendJeiRegistrationConfirmationEmail({
        to: parentEmail,
        parentName,
        registrationId: registration.id,
        selectedProgramName: registration.selectedProgramName,
        studentCount: registration.studentCount,
        totalAmountCents: registration.totalAmountCents,
        paymentUrl,
      })
    } catch (emailErr) {
      console.error('[JEI] Parent confirmation email failed (registration was saved):', emailErr)
      parentEmailNote =
        ' We could not send the confirmation email—check spam or contact info@creators-lab.org if you need a copy.'
    }

    return NextResponse.json({
      ok: true,
      registrationId: registration.id,
      paymentUrl,
      stripeUrl: paymentUrl,
      message:
        'Registration saved. Complete payment with the Stripe link below to secure your spot. A confirmation email has been sent.' +
        parentEmailNote,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'PROGRAM_UNAVAILABLE') {
      return NextResponse.json({ error: 'Selected program is not available.' }, { status: 400 })
    }

    const errMsg = error instanceof Error ? error.message : String(error)
    if (errMsg.includes('Unknown argument `age`')) {
      return NextResponse.json(
        {
          error:
            'The database client is out of sync with the code (student age field). Stop the dev server, run `npx prisma generate`, then start again with `npm run dev`. In production, redeploy so the build runs Prisma generate.',
        },
        { status: 503 }
      )
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('JEI registration Prisma error:', error.code, error.meta, error.message)
      if (error.code === 'P2022') {
        return NextResponse.json(
          {
            error:
              'The database is missing a required column (often after a code update). Ask your admin to run: npx prisma db push or deploy the latest migration.',
          },
          { status: 503 }
        )
      }
    }

    console.error('Error creating JEI registration:', error)

    const isDev = process.env.NODE_ENV === 'development'
    const hint =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to submit JEI registration.',
        ...(isDev ? { debug: hint } : {}),
      },
      { status: 500 }
    )
  }
}
