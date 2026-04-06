import crypto from 'crypto'
import { sendEmail } from '@/lib/email'

export function generateMagicToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function hashMagicToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function buildCancelUrl(token: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://creators-lab.org')
  return `${baseUrl}/JEI/register/cancel?token=${encodeURIComponent(token)}`
}

export async function sendJeiRegistrationConfirmationEmail(params: {
  to: string
  parentName: string
  registrationId: string
  selectedProgramName?: string | null
  studentCount: number
  totalAmountCents: number
}) {
  const programText = params.selectedProgramName
    ? `Program: ${params.selectedProgramName}`
    : 'Updates-only registration (no program selected)'
  const amountText = params.totalAmountCents > 0 ? `Estimated total: $${(params.totalAmountCents / 100).toFixed(2)}` : ''

  await sendEmail({
    to: params.to,
    subject: 'Creators Lab JEI Registration Received',
    text: `Hi ${params.parentName},\n\nThanks for registering with Creators Lab JEI programs.\nRegistration ID: ${params.registrationId}\n${programText}\nStudents: ${params.studentCount}\n${amountText}\n\nOur team will review your submission and send an invoice/payment link if applicable.\n\n- Creators Lab`,
  })
}

export async function sendJeiCancellationMagicLinkEmail(params: {
  to: string
  parentName: string
  cancelUrl: string
}) {
  await sendEmail({
    to: params.to,
    subject: 'Creators Lab JEI Cancellation Link',
    text: `Hi ${params.parentName},\n\nUse the secure link below to review cancellation options for your JEI registration:\n${params.cancelUrl}\n\nThis link expires in 24 hours.\n\n- Creators Lab`,
  })
}

export async function sendJeiCancellationOutcomeEmail(params: {
  to: string
  parentName: string
  mode: 'refund' | 'credit'
  refundAmount?: string
  processingFee?: string
  creditAmount?: string
  creditExpiresAt?: string
}) {
  const body =
    params.mode === 'refund'
      ? `Your cancellation is confirmed.\nRefund amount: $${params.refundAmount}\nProcessing fee (3%): $${params.processingFee}\n`
      : `Your cancellation is confirmed.\nCredit amount: $${params.creditAmount}\nCredit expiry: ${params.creditExpiresAt}\n`

  await sendEmail({
    to: params.to,
    subject: 'Creators Lab JEI Cancellation Confirmation',
    text: `Hi ${params.parentName},\n\n${body}\n- Creators Lab`,
  })
}
