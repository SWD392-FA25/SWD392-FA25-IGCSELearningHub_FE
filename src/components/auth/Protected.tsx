/**
 * Protected Route Component
 * Wraps pages that require authentication
 */

'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

interface ProtectedProps {
  children: ReactNode
  roles?: string[]
  fallback?: ReactNode
}

export function Protected({ children, roles, fallback }: ProtectedProps) {
  const { user, initialized, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!initialized) return

    console.log('🔐 Protected Route Check:', { 
      initialized, 
      isAuthenticated, 
      userRole: user?.role,
      requiredRoles: roles,
      pathname 
    })

    // Not authenticated - redirect to login with return URL
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/login?redirect=${returnUrl}`)
      return
    }

    // Check role if specified
    if (roles && roles.length > 0 && user) {
      const hasRole = roles.some(role => role.toLowerCase() === user.role.toLowerCase())
      console.log('👤 Role check:', { userRole: user.role, requiredRoles: roles, hasRole })
      if (!hasRole) {
        console.log('❌ Access denied, redirecting to home')
        // Unauthorized - redirect to home or show error
        router.push('/')
      }
    }
  }, [initialized, isAuthenticated, user, roles, router, pathname])

  // Show loading while checking auth
  if (!initialized) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Not authenticated - don't render (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // Check role
  if (roles && roles.length > 0 && user) {
    const hasRole = roles.some(role => role.toLowerCase() === user.role.toLowerCase())
    if (!hasRole) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="mt-2 text-muted-foreground">
              You don&apos;t have permission to access this page.
            </p>
          </div>
        </div>
      )
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>
}
