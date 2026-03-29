import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
  from?: string
  replyTo?: string
}

function getTransporter() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !port || !user || !pass) {
    throw new Error('SMTP configuration is missing')
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  })
}

export async function sendEmail(options: EmailOptions) {
  const transporter = getTransporter()
  const smtpUser = process.env.SMTP_USER
  const primaryFrom = options.from ?? process.env.SMTP_FROM ?? smtpUser

  try {
    return await transporter.sendMail({
      from: primaryFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    })
  } catch (error: any) {
    const message = String(error?.message || '')
    const fromPolicyError =
      /from|sender|authenticated|not allowed|not owned|alias|envelope/i.test(message)

    // Retry once using SMTP auth user as sender when provider rejects custom "From".
    if (fromPolicyError && smtpUser && primaryFrom !== smtpUser) {
      console.warn(
        `Email send failed with from="${primaryFrom}". Retrying with smtp user as sender.`
      )
      return transporter.sendMail({
        from: smtpUser,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo ?? (options.from || process.env.SMTP_FROM),
      })
    }

    throw error
  }
}
