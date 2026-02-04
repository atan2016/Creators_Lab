import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { sendEmail } from '@/lib/email'

function generateTemporaryPassword() {
  return randomBytes(8).toString('base64url')
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Only admins can create user accounts.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email, password, role } = body

    if (!name || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Normalize email to lowercase for case-insensitive lookup
    const emailLower = email.toLowerCase().trim()

    // Check if user already exists (case-insensitive)
    const existingUsers = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM "User" WHERE LOWER(email) = LOWER(${emailLower}) LIMIT 1
    `
    
    const existingUser = existingUsers[0] || null

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const requestedPassword =
      typeof password === 'string' && password.trim().length > 0 ? password.trim() : null
    const tempPassword = requestedPassword || generateTemporaryPassword()
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    // Create user (store email in lowercase for consistency)
    const user = await prisma.user.create({
      data: {
        name,
        email: emailLower,
        password: hashedPassword,
        role,
        mustResetPassword: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    try {
      await sendEmail({
        to: email,
        subject: 'Your temporary password - CreatorsLab LMS (Yamas)',
        text: `Your account has been created. Your temporary password is: ${tempPassword}\n\nPlease log in and change your password immediately at ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password.`,
        html: `
          <p>Your account has been created.</p>
          <p><strong>Your temporary password is:</strong> ${tempPassword}</p>
          <p>Please log in and change your password immediately at <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password">Reset Password</a>.</p>
        `,
      })
    } catch (emailError: any) {
      console.error('Failed to send welcome email:', emailError)
      // Return the password so admin can share it manually
      return NextResponse.json(
        {
          user,
          password: tempPassword,
          warning: 'User created, but failed to send email. Please share the temporary password manually.',
        },
        { status: 201 }
      )
    }

    // Always return the password so admin can view it
    return NextResponse.json({ 
      user, 
      password: tempPassword 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
