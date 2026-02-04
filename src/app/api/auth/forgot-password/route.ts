import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { sendEmail } from '@/lib/email'

function generateTemporaryPassword() {
  return randomBytes(8).toString('base64url')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Normalize email to lowercase for case-insensitive lookup
    const emailLower = email.toLowerCase().trim()

    // Use raw query for case-insensitive email lookup
    const users = await prisma.$queryRaw<Array<{
      id: string
      email: string
    }>>`
      SELECT id, email FROM "User" WHERE LOWER(email) = LOWER(${emailLower}) LIMIT 1
    `
    
    const user = users[0] || null

    // Always return success to avoid user enumeration
    if (!user) {
      return NextResponse.json({ success: true })
    }

    const tempPassword = generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, mustResetPassword: true },
    })

    try {
      await sendEmail({
        to: email,
        subject: 'Your new password - CreatorsLab LMS (Yamas)',
        text: `Your password has been reset. Your new temporary password is: ${tempPassword}\n\nPlease log in and change your password as soon as possible.`,
        html: `
          <p>Your password has been reset.</p>
          <p><strong>Your new temporary password is:</strong> ${tempPassword}</p>
          <p>Please log in and change your password as soon as possible.</p>
        `,
      })
      console.log('Password reset email sent successfully to:', email)
    } catch (emailError: any) {
      console.error('Failed to send password reset email:', emailError)
      // Still return success to avoid user enumeration, but log the error
      // The password has already been reset, so the user can contact support
      return NextResponse.json({ 
        success: true,
        message: 'Password has been reset, but email delivery failed. Please contact your administrator.'
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
