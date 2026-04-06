export type JeiCancellationOutcome = {
  mode: 'refund' | 'credit'
  refundAmountCents: number
  processingFeeCents: number
  creditAmountCents: number
  creditExpiresAt: Date | null
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

export function evaluateJeiCancellationPolicy(
  totalAmountCents: number,
  programStartDate: Date,
  now = new Date()
): JeiCancellationOutcome {
  const diffDays = (programStartDate.getTime() - now.getTime()) / MS_PER_DAY
  const eligibleForRefund = diffDays >= 30

  if (eligibleForRefund) {
    const processingFeeCents = Math.round(totalAmountCents * 0.03)
    const refundAmountCents = Math.max(totalAmountCents - processingFeeCents, 0)
    return {
      mode: 'refund',
      refundAmountCents,
      processingFeeCents,
      creditAmountCents: 0,
      creditExpiresAt: null,
    }
  }

  const creditExpiresAt = new Date(now)
  creditExpiresAt.setFullYear(creditExpiresAt.getFullYear() + 1)

  return {
    mode: 'credit',
    refundAmountCents: 0,
    processingFeeCents: 0,
    creditAmountCents: totalAmountCents,
    creditExpiresAt,
  }
}

export function formatCurrencyFromCents(cents: number) {
  return (cents / 100).toFixed(2)
}
