import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          // Normalize email to lowercase for case-insensitive lookup
          const emailLower = (credentials.email as string).toLowerCase().trim()
          console.log('Looking up user (case-insensitive):', emailLower)
          
          // Use raw query for case-insensitive email lookup
          const users = await prisma.$queryRaw<Array<{
            id: string
            email: string
            password: string
            name: string
            role: string
            mustResetPassword: boolean
            lastLoginAt: Date | null
          }>>`
            SELECT * FROM "User" WHERE LOWER(email) = LOWER(${emailLower}) LIMIT 1
          `
          
          const user = users[0] || null

          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          console.log('User found, checking password...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          // Update last login time
          try {
            const loginTime = new Date()
            console.log('Attempting to update lastLoginAt for user:', user.id, 'at', loginTime.toISOString())
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: loginTime },
            })
            console.log('Last login time updated successfully for:', user.email, 'to', updatedUser.lastLoginAt)
          } catch (updateError: any) {
            // Log error but don't fail authentication
            console.error('Error updating last login time:', updateError)
            console.error('Error details:', {
              message: updateError?.message,
              code: updateError?.code,
              meta: updateError?.meta,
            })
            // Continue with authentication even if update fails
          }

          console.log('Authentication successful for:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            mustResetPassword: user.mustResetPassword,
          }
        } catch (error: any) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          const userAny = user as any
          const role =
            typeof userAny?.role === 'string' ? userAny.role : undefined
          const id = typeof userAny?.id === 'string' ? userAny.id : userAny?.id
          const mustResetPassword =
            typeof userAny?.mustResetPassword === 'boolean' ? userAny.mustResetPassword : undefined
          if (role !== undefined) {
            ;(token as any).role = role
          }
          if (id !== undefined) {
            ;(token as any).id = id
          }
          if (mustResetPassword !== undefined) {
            ;(token as any).mustResetPassword = mustResetPassword
          }
        }
      } catch (error) {
        console.error('JWT callback error:', error)
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        const t = token as any
        // Direct assignment with type safety
        if (t && 'role' in t && typeof t.role === 'string') {
          (session.user as any).role = t.role
        }
        if (t && 'id' in t && typeof t.id === 'string') {
          (session.user as any).id = t.id
        }
        if (t && 'mustResetPassword' in t && typeof t.mustResetPassword === 'boolean') {
          (session.user as any).mustResetPassword = t.mustResetPassword
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
})
