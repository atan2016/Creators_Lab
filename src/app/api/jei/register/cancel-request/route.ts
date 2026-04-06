import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  buildCancelUrl,
  generateMagicToken,
  hashMagicToken,
  sendJeiCancellationMagicLinkEmail,
} from '@/lib/jei-email'

export async function POST(request: NextRequest) {
  try {
    const { registrationId, parentEmail } = await request.json()
    const db: any = prisma as any

    if (!registrationId || !parentEmail) {
      return NextResponse.json({ error: 'Registration ID and parent email are required.' }, { status: 400 })
    }

    const registration = await db.jeiRegistration.findUnique({
      where: { id: registrationId },
    })

    if (!registration || registration.parentEmail.toLowerCase() !== String(parentEmail).toLowerCase()) {
      return NextResponse.json({ error: 'Registration not found for provided email.' }, { status: 404 })
    }

    if (
      registration.status === 'CANCELLED_REFUNDED' ||
      registration.status === 'CANCELLED_CREDITED'
    ) {
      return NextResponse.json({ error: 'Registration is already cancelled.' }, { status: 400 })
    }

    const token = generateMagicToken()
    const tokenHash = hashMagicToken(token)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await db.jeiCancellationToken.create({
      data: {
        registrationId: registration.id,
        tokenHash,
        expiresAt,
      },
    })

    await sendJeiCancellationMagicLinkEmail({
      to: registration.parentEmail,
      parentName: registration.parentName,
      cancelUrl: buildCancelUrl(token),
    })

    return NextResponse.json({ ok: true, message: 'Cancellation link sent to parent email.' })
  } catch (error) {
    console.error('Error generating cancellation link:', error)
    return NextResponse.json({ error: 'Failed to send cancellation link.' }, { status: 500 })
  }
}
