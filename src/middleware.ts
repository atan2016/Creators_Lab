import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname

    // Define public pages and API routes first (check before any auth)
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

    const publicApiRoutes = [
      '/api/create-checkout-session', // Stripe donations
      '/api/move-past-events', // Cron job
    ]

    // Allow all NextAuth API routes (they handle their own authentication)
    if (path.startsWith('/api/auth/')) {
      return NextResponse.next()
    }

    // Allow public API routes immediately
    if (path.startsWith('/api/') && publicApiRoutes.includes(path)) {
      return NextResponse.next()
    }

    // Allow public pages immediately (before any auth check)
    if (publicPages.includes(path)) {
      return NextResponse.next()
    }

    // Get session - in NextAuth v5, auth() reads from request automatically
    // Only check auth for protected routes
    let session = null
    try {
      session = await auth()
    } catch (error) {
      // If auth fails (e.g., database connection issue), treat as no session
      // This allows public pages to still work even if auth is temporarily unavailable
      console.error('Middleware auth error:', error)
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

    // For protected page routes, redirect to login if no session
    if (!session) {
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
  } catch (error) {
    // If middleware fails completely, log error but allow request to proceed
    // This prevents middleware errors from causing 404s
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
