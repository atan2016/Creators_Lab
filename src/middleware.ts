import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TEMPORARILY DISABLED to diagnose 404 issue
// If this fixes the 404, then middleware is the problem
export async function middleware(request: NextRequest) {
  // Allow all requests through - no middleware logic
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all except static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
