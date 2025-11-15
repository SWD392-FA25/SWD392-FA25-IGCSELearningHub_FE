/**
 * useAuth Hook
 * Client-side authentication state management using React Context
 */

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { AuthUser, LoginRequest } from '@/lib/auth/types'
import * as authApi from '@/lib/auth/api'
import * as storage from '@/lib/auth/storage'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: string | null
  initialized: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (req: LoginRequest, redirectTo?: string) => Promise<void>
  signInWithGoogle: (
    googleIdToken: string,
    redirectTo?: string
  ) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

AuthContext.displayName = 'AuthContext'

/**
 * AuthProvider Component
 * Wrap your app with this provider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Hydrate auth state from cookies on mount
  useEffect(() => {
    const hydrateAuth = async () => {
      if (typeof window !== 'undefined') {
        try {
          const session = await storage.readSession()
          setUser(session?.user || null)
        } catch {
          setUser(null)
        } finally {
          setInitialized(true)
        }
      }
    }
    hydrateAuth()
  }, [])

  const signIn = useCallback(
    async (req: LoginRequest, redirectTo = '/') => {
      setLoading(true)
      setError(null)
      try {
        const authResponse = await authApi.login(req)
        await storage.saveSession({
          user: authResponse.user,
          tokens: authResponse.tokens,
        })
        setUser(authResponse.user)
        router.push(redirectTo)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const signInWithGoogle = useCallback(
    async (googleIdToken: string, redirectTo = '/') => {
      setLoading(true)
      setError(null)
      try {
        const authResponse = await authApi.googleLogin(googleIdToken)
        await storage.saveSession({
          user: authResponse.user,
          tokens: authResponse.tokens,
        })
        setUser(authResponse.user)
        router.push(redirectTo)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Google login failed'
        setError(errorMessage)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [router]
  )

  const signOut = useCallback(async () => {
    try {
      // Call server-side signout to clear cookies
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch (error) {
      console.error('Sign out API error:', error)
    } finally {
      // Clear client-side storage regardless
      storage.clearSession()
      setUser(null)
      setError(null)
      router.push('/login')
    }
  }, [router])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    error,
    initialized,
    isAuthenticated: !!user,
    signIn,
    signInWithGoogle,
    signOut,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Main useAuth hook for components
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Hook to check if user has specific role(s)
 */
export function useRole(allowedRoles?: string[]) {
  const { user } = useAuth()

  const hasRole = (role: string) => user?.role === role
  const hasAnyRole = (roles: string[]) => roles.some(hasRole)
  const isAllowed = allowedRoles ? hasAnyRole(allowedRoles) : true

  return {
    hasRole,
    hasAnyRole,
    isAllowed,
    currentRole: user?.role,
  }
}
