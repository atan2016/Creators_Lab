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

const DEFAULT_JEI_ADMIN_NOTIFY_EMAIL = 'ashleyt@creators-lab.org'

/** Staff alert when a JEI registration is saved. Does not throw (logs on failure). */
export async function notifyJeiAdminNewRegistration(params: {
  parentName: string
  parentEmail: string
  parentPhone: string
  items: {
    programName: string
    studentCount: number
    registrationId: string
    /** One line per student, e.g. "First Last (age 10)" */
    studentSummaries?: string[]
  }[]
}) {
  const to = process.env.JEI_ADMIN_NOTIFY_EMAIL?.trim() || DEFAULT_JEI_ADMIN_NOTIFY_EMAIL
  const totalEnrollments = params.items.reduce((sum, item) => sum + item.studentCount, 0)
  const programLines = params.items.map((item, i) => {
    let block =
      `${i + 1}. ${item.programName}\n   Enrollments (students): ${item.studentCount}\n   Registration ID: ${item.registrationId}`
    if (item.studentSummaries?.length) {
      block += `\n   Students:\n${item.studentSummaries.map((line) => `     • ${line}`).join('\n')}`
    }
    return block
  })
  const text =
    `A new JEI program registration was submitted.\n\n` +
    `Parent: ${params.parentName}\n` +
    `Email: ${params.parentEmail}\n` +
    `Phone: ${params.parentPhone}\n\n` +
    `Programs:\n${programLines.join('\n\n')}\n\n` +
    `Total enrollments (students across all programs): ${totalEnrollments}\n`

  const subject = `JEI: New registration — ${totalEnrollments} student${totalEnrollments === 1 ? '' : 's'}`

  try {
    await sendEmail({
      to,
      subject,
      text,
      replyTo: params.parentEmail,
    })
  } catch (err) {
    console.error('[JEI] Failed to send admin registration notification:', err)
  }
}

export async function sendJeiRegistrationConfirmationEmail(params: {
  to: string
  parentName: string
  registrationId: string
  selectedProgramName?: string | null
  studentCount: number
  totalAmountCents: number
  paymentUrl?: string
}) {
  const programText = params.selectedProgramName
    ? `Program: ${params.selectedProgramName}`
    : 'Updates-only registration (no program selected)'
  const amountText = params.totalAmountCents > 0 ? `Estimated total: $${(params.totalAmountCents / 100).toFixed(2)}` : ''
  const payBlock = params.paymentUrl
    ? `Complete payment for your spot using this secure Stripe link:\n${params.paymentUrl}\n`
    : 'If you have not paid yet, use the payment link on the registration confirmation page or contact Creators Lab for assistance.\n'

  await sendEmail({
    to: params.to,
    subject: 'Creators Lab JEI Registration Received',
    text: `Hi ${params.parentName},\n\nThanks for registering with Creators Lab JEI programs.\nRegistration ID: ${params.registrationId}\n${programText}\nStudents: ${params.studentCount}\n${amountText}\n\n${payBlock}\n- Creators Lab`,
  })
}

export async function sendJeiRegistrationBatchConfirmationEmail(params: {
  to: string
  parentName: string
  items: {
    registrationId: string
    programName: string
    studentCount: number
    totalAmountCents: number
    paymentUrl?: string
  }[]
  grandTotalCents: number
}) {
  const lines = params.items.map((item, i) => {
    const amt = `$${(item.totalAmountCents / 100).toFixed(2)}`
    const pay = item.paymentUrl
      ? `Pay for this program: ${item.paymentUrl}\n`
      : 'Payment link unavailable — contact Creators Lab.\n'
    return (
      `--- Program ${i + 1} ---\n` +
      `${item.programName}\n` +
      `Registration ID: ${item.registrationId}\n` +
      `Students: ${item.studentCount} · Estimated: ${amt}\n` +
      `${pay}`
    )
  })
  const grand = `$${(params.grandTotalCents / 100).toFixed(2)}`
  const body =
    `Hi ${params.parentName},\n\n` +
    `Thanks for registering with Creators Lab JEI programs. Below is a summary for each program you selected. Complete payment using each Stripe link to secure your spots.\n\n` +
    `${lines.join('\n')}\n` +
    `Combined estimated total: ${grand}\n\n` +
    `- Creators Lab`

  await sendEmail({
    to: params.to,
    subject: 'Creators Lab JEI Registration Received',
    text: body,
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
