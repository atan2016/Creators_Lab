import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can send test emails.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    const testPassword = 'TestPassword123!'
    
    try {
      await sendEmail({
        to: email,
        subject: 'Test Email - CreatorsLab LMS (Yamas)',
        text: `This is a test email from the CreatorsLab LMS (Yamas) system.\n\nYour test temporary password is: ${testPassword}\n\nThis is just a test - you can ignore this email.\n\nTest sent at: ${new Date().toISOString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #065f46;">Test Email - CreatorsLab LMS (Yamas)</h2>
            <p>This is a test email from the CreatorsLab LMS (Yamas) system.</p>
            <p><strong>Your test temporary password is:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${testPassword}</code></p>
            <p style="color: #6b7280; font-size: 0.9em;">This is just a test - you can ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 0.85em;">Test sent at: ${new Date().toLocaleString()}</p>
          </div>
        `,
      })

      return NextResponse.json({ 
        success: true,
        message: `Test email sent successfully to ${email}` 
      })
    } catch (emailError: any) {
      console.error('Failed to send test email:', emailError)
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: emailError?.message || 'Unknown error',
          hint: 'Please check your SMTP configuration in .env file (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)'
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
