import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Never intercept Next.js assets (CSS/JS/fonts/chunks). If these hit auth logic, the site renders unstyled.
  if (path.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // CRITICAL: Allow all public pages immediately - no auth check at all
  // This MUST happen before any imports or async operations
  // All JEI pages (register, pay, cancel, etc.) must stay public — no session required.
  if (
    path === '/JEI' ||
    path.startsWith('/JEI/') ||
    path === '/jei' ||
    path.startsWith('/jei/')
  ) {
    return NextResponse.next()
  }

  const publicPages = [
    '/',
    '/privacy-policy',
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
    '/api/create-checkout-session',
    '/api/move-past-events',
    '/api/auth',
  ]

  /** JEI public APIs (registration, payment session, saved students — no login). */
  const isPublicJeiApi =
    path.startsWith('/api/jei/programs') ||
    path.startsWith('/api/jei/register') ||
    path === '/api/jei/checkout-session' ||
    path === '/api/jei/parent-students'

  // Allow public pages - bypass all middleware logic
  if (publicPages.includes(path)) {
    return NextResponse.next()
  }

  // Allow static assets from public folder (data, assets, scripts, styles)
  // These are used by homepage events, events page, search, and other public content
  if (
    path.startsWith('/data/') ||
    path.startsWith('/assets/') ||
    path === '/search.js' ||
    path === '/search.css'
  ) {
    return NextResponse.next()
  }

  // Allow public API routes
  if (path.startsWith('/api/auth/') || isPublicJeiApi || publicApiRoutes.includes(path)) {
    return NextResponse.next()
  }

  // For protected routes, dynamically import auth to prevent loading errors
  let session = null
  try {
    const { auth } = await import('@/lib/auth')
    session = await auth()
  } catch (error) {
    // Silently fail - allow request to proceed
    session = null
  }

  // Protected API routes
  if (path.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Protected page routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = (session.user as any)?.role
  const mustResetPassword = (session.user as any)?.mustResetPassword

  if (mustResetPassword && path !== '/reset-password') {
    return NextResponse.redirect(new URL('/reset-password', request.url))
  }

  if (path === '/register' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/teacher') && role !== 'TEACHER' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path.startsWith('/student') && role !== 'STUDENT' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
