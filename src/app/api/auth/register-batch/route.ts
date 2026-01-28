import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { sendEmail } from '@/lib/email'

function generateTemporaryPassword() {
  return randomBytes(8).toString('base64url')
}

interface UserInput {
  name: string
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  password?: string
}

interface BatchResult {
  success: UserInput[]
  errors: Array<{ user: UserInput; error: string }>
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
    const { users, defaultRole } = body

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: 'Users array is required and must not be empty' },
        { status: 400 }
      )
    }

    const results: BatchResult = {
      success: [],
      errors: [],
    }

    // Process each user
    for (const userInput of users) {
      const { name, email, role, password } = userInput
      const userRole = role || defaultRole || 'STUDENT'

      // Validate required fields
      if (!name || !email || !userRole) {
        results.errors.push({
          user: userInput,
          error: 'Missing required fields (name, email, or role)',
        })
        continue
      }

      // Validate role
      if (!['ADMIN', 'TEACHER', 'STUDENT'].includes(userRole)) {
        results.errors.push({
          user: userInput,
          error: `Invalid role: ${userRole}`,
        })
        continue
      }

      // Validate Gmail for teachers
      if (userRole === 'TEACHER' && !email.endsWith('@gmail.com')) {
        results.errors.push({
          user: userInput,
          error: 'Teachers must use a Gmail address',
        })
        continue
      }

      // Check if user already exists
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        })

        if (existingUser) {
          results.errors.push({
            user: userInput,
            error: 'User with this email already exists',
          })
          continue
        }

        // Generate password if not provided
        const requestedPassword =
          typeof password === 'string' && password.trim().length > 0
            ? password.trim()
            : null
        const tempPassword = requestedPassword || generateTemporaryPassword()
        const hashedPassword = await bcrypt.hash(tempPassword, 10)

        // Create user
        const user = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: userRole,
            mustResetPassword: true,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        })

        // Send email (don't fail the whole batch if email fails)
        try {
          await sendEmail({
            to: email,
            subject: 'Your temporary password - CreatorsLab LMS',
            text: `Your account has been created. Your temporary password is: ${tempPassword}\n\nPlease log in and change your password immediately at ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password.`,
            html: `
              <p>Your account has been created.</p>
              <p><strong>Your temporary password is:</strong> ${tempPassword}</p>
              <p>Please log in and change your password immediately at <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password">Reset Password</a>.</p>
            `,
          })
        } catch (emailError: any) {
          console.error(`Failed to send email to ${email}:`, emailError)
          // Continue - user is created, email failure is logged
        }

        results.success.push(userInput)
      } catch (error: any) {
        results.errors.push({
          user: userInput,
          error: error?.message || 'Failed to create user',
        })
      }
    }

    return NextResponse.json(
      {
        success: results.success.length,
        errors: results.errors.length,
        results,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Batch registration error:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
