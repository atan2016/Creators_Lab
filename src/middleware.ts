import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow all NextAuth API routes (they handle their own authentication)
  if (path.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Get session - in NextAuth v5, auth() reads from request automatically
  let session
  try {
    session = await auth()
  } catch (error) {
    // If auth fails, treat as no session
    session = null
  }

  // For other API routes, require authentication
  if (path.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // For page routes, check authentication
  if (!session) {
    // Allow public pages (Creators_Lab marketing pages)
    const publicPages = [
      '/',
      '/about',
      '/resources',
      '/events',
      '/careers',
      '/showcase',
      '/what-we-teach',
      '/login',
      '/forgot-password',
      '/reset-password',
    ]
    if (publicPages.includes(path)) {
      return NextResponse.next()
    }
    // Redirect to login for protected pages
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = (session.user as any)?.role
  const mustResetPassword = (session.user as any)?.mustResetPassword

  if (mustResetPassword) {
    if (path.startsWith('/api/')) {
      if (path.startsWith('/api/auth/reset-password')) {
        return NextResponse.next()
      }
      return NextResponse.json(
        { error: 'Password reset required' },
        { status: 403 }
      )
    }
    if (path !== '/reset-password') {
      return NextResponse.redirect(new URL('/reset-password', request.url))
    }
  }

  // Restrict /register route to admins only
  if (path === '/register' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Admin routes
  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Teacher routes
  if (path.startsWith('/teacher') && role !== 'TEACHER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Student routes
  if (path.startsWith('/student') && role !== 'STUDENT' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/teacher/:path*', 
    '/student/:path*', 
    '/api/:path*',
    '/register',
    '/reset-password',
  ],
}
