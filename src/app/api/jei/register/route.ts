import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendJeiRegistrationConfirmationEmail } from '@/lib/jei-email'

type RegisterPayload = {
  parentName: string
  parentEmail: string
  parentPhone: string
  emergencyPhone: string
  authorizedPickupName: string
  authorizedPickupPhone: string
  authorizedPickupRelation?: string
  studentNames: string[]
  selectedProgramId?: string
  updatesOnly?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as RegisterPayload
    const db: any = prisma as any

    const parentName = payload.parentName?.trim()
    const parentEmail = payload.parentEmail?.trim().toLowerCase()
    const parentPhone = payload.parentPhone?.trim()
    const emergencyPhone = payload.emergencyPhone?.trim()
    const studentNames = (payload.studentNames || []).map((n) => n.trim()).filter(Boolean)
    const updatesOnly = Boolean(payload.updatesOnly)

    if (!parentName || !parentEmail || !parentPhone || !emergencyPhone) {
      return NextResponse.json({ error: 'Parent and contact fields are required.' }, { status: 400 })
    }

    if (updatesOnly) {
      await db.updatesSubscriber.upsert({
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

    if (!payload.selectedProgramId) {
      return NextResponse.json({ error: 'Please select a program.' }, { status: 400 })
    }
    if (studentNames.length === 0) {
      return NextResponse.json({ error: 'Add at least one student.' }, { status: 400 })
    }
    if (!payload.authorizedPickupName?.trim() || !payload.authorizedPickupPhone?.trim()) {
      return NextResponse.json({ error: 'Authorized pickup name and phone are required.' }, { status: 400 })
    }

    const program = await db.jeiProgram.findUnique({ where: { id: payload.selectedProgramId } })
    if (!program || !program.isActive) {
      return NextResponse.json({ error: 'Selected program is not available.' }, { status: 400 })
    }

    const totalAmountCents = studentNames.length * program.weeklyPrice * 100
    const policySnapshot =
      'Full refunds are available up to 30 days before program start (minus 3% processing fee). Within 30 days, cancellation is credit-only. Credit expires in 1 year.'

    const registration = await db.jeiRegistration.create({
      data: {
        parentName,
        parentEmail,
        parentPhone,
        emergencyPhone,
        selectedProgramId: program.id,
        selectedProgramName: program.name,
        selectedProgramPrice: program.weeklyPrice,
        selectedProgramDates: program.dateLabel,
        studentCount: studentNames.length,
        totalAmountCents,
        status: 'PENDING_REVIEW',
        updatesOnly: false,
        policySnapshot,
        students: {
          create: studentNames.map((name) => ({ name })),
        },
        authorizedPickup: {
          create: {
            name: payload.authorizedPickupName.trim(),
            phone: payload.authorizedPickupPhone.trim(),
            relation: payload.authorizedPickupRelation?.trim() || null,
          },
        },
      },
      include: { students: true },
    })

    await sendJeiRegistrationConfirmationEmail({
      to: parentEmail,
      parentName,
      registrationId: registration.id,
      selectedProgramName: registration.selectedProgramName,
      studentCount: registration.studentCount,
      totalAmountCents: registration.totalAmountCents,
    })

    return NextResponse.json({
      ok: true,
      registrationId: registration.id,
      message: 'Registration submitted. We will email an invoice/payment link after review.',
    })
  } catch (error) {
    console.error('Error creating JEI registration:', error)
    return NextResponse.json({ error: 'Failed to submit JEI registration.' }, { status: 500 })
  }
}
