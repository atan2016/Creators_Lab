import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashMagicToken, sendJeiCancellationOutcomeEmail } from '@/lib/jei-email'
import { evaluateJeiCancellationPolicy, formatCurrencyFromCents } from '@/lib/jei-policy'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const db: any = prisma as any

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 })
    }

    const tokenHash = hashMagicToken(String(token))
    const cancellationToken = await db.jeiCancellationToken.findUnique({
      where: { tokenHash },
      include: { registration: { include: { selectedProgram: true } } },
    })

    if (!cancellationToken) {
      return NextResponse.json({ error: 'Invalid cancellation token.' }, { status: 404 })
    }
    if (cancellationToken.usedAt) {
      return NextResponse.json({ error: 'This cancellation link has already been used.' }, { status: 400 })
    }
    if (new Date(cancellationToken.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This cancellation link has expired.' }, { status: 400 })
    }

    const registration = cancellationToken.registration
    if (
      registration.status === 'CANCELLED_REFUNDED' ||
      registration.status === 'CANCELLED_CREDITED'
    ) {
      return NextResponse.json({ error: 'Registration is already cancelled.' }, { status: 400 })
    }

    if (!registration.selectedProgram?.startDate) {
      return NextResponse.json({ error: 'Program start date not found.' }, { status: 400 })
    }

    const outcome = evaluateJeiCancellationPolicy(
      registration.totalAmountCents,
      new Date(registration.selectedProgram.startDate),
      new Date()
    )

    const updateData: any = {
      cancelledAt: new Date(),
      status: outcome.mode === 'refund' ? 'CANCELLED_REFUNDED' : 'CANCELLED_CREDITED',
    }

    await db.$transaction(async (tx: any) => {
      await tx.jeiRegistration.update({
        where: { id: registration.id },
        data: updateData,
      })

      await tx.jeiCancellationToken.update({
        where: { id: cancellationToken.id },
        data: { usedAt: new Date() },
      })

      if (outcome.mode === 'credit' && outcome.creditExpiresAt) {
        await tx.jeiCredit.create({
          data: {
            registrationId: registration.id,
            amountCents: outcome.creditAmountCents,
            expiresAt: outcome.creditExpiresAt,
          },
        })
      }
    })

    if (outcome.mode === 'refund') {
      await sendJeiCancellationOutcomeEmail({
        to: registration.parentEmail,
        parentName: registration.parentName,
        mode: 'refund',
        refundAmount: formatCurrencyFromCents(outcome.refundAmountCents),
        processingFee: formatCurrencyFromCents(outcome.processingFeeCents),
      })
    } else {
      await sendJeiCancellationOutcomeEmail({
        to: registration.parentEmail,
        parentName: registration.parentName,
        mode: 'credit',
        creditAmount: formatCurrencyFromCents(outcome.creditAmountCents),
        creditExpiresAt: outcome.creditExpiresAt?.toLocaleDateString(),
      })
    }

    return NextResponse.json({
      ok: true,
      mode: outcome.mode,
      refundAmount: formatCurrencyFromCents(outcome.refundAmountCents),
      processingFee: formatCurrencyFromCents(outcome.processingFeeCents),
      creditAmount: formatCurrencyFromCents(outcome.creditAmountCents),
      creditExpiresAt: outcome.creditExpiresAt,
    })
  } catch (error) {
    console.error('Error confirming cancellation:', error)
    return NextResponse.json({ error: 'Failed to process cancellation.' }, { status: 500 })
  }
}
