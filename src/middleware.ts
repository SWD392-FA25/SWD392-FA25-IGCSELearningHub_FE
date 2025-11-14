/**
 * Next.js Middleware
 * Server-side route protection and authentication
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

/**
 * Protected route patterns
 * Add routes that require authentication
 */
const protectedRoutes = [
  '/pages/admin',
  '/pages/teacher',
  '/pages/student',
  '/pages/parent',
  '/teacher',
  '/courses',
]

/**
 * Public routes that should redirect to dashboard if already authenticated
 */
const authRoutes = ['/login', '/register']

/**
 * Routes accessible to guests
 */
const guestRoutes = ['/', '/about', '/courses']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session from cookies
  const sessionCookie = request.cookies.get('session')?.value
  const isGuestCookie = request.cookies.get('isGuest')?.value === 'true'

  let session = null
  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie)
    } catch (error) {
      console.error('Failed to parse session cookie:', error)
    }
  }

  const isAuthenticated = !!session?.user
  const isGuest =
    isGuestCookie ||
    (!isAuthenticated &&
      guestRoutes.some((route) => pathname.startsWith(route)))

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    const redirectTo =
      request.nextUrl.searchParams.get('redirect') || '/pages/admin/dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated && !isGuest) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based access control (optional)
  if (isAuthenticated && session?.user) {
    const userRole = session.user.role?.toLowerCase()

    // Admin routes
    if (pathname.startsWith('/pages/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Teacher routes
    if (
      (pathname.startsWith('/pages/teacher') || pathname.startsWith('/teacher')) &&
      userRole !== 'teacher' &&
      userRole !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Student routes
    if (
      pathname.startsWith('/pages/student') &&
      userRole !== 'student' &&
      userRole !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    // Parent routes
    if (
      pathname.startsWith('/pages/parent') &&
      userRole !== 'parent' &&
      userRole !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

/**
 * Configure which routes middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
