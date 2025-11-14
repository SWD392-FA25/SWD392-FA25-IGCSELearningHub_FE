/**
 * Auth Storage
 * Manages session data in localStorage (client-side only)
 */

import type { AuthSession, AuthUser } from './types'

/**
 * Save session to localStorage
 * Lưu accessToken, refreshToken và thông tin user vào localStorage
 */
export async function saveSession(session: AuthSession): Promise<void> {
  if (typeof window === 'undefined') {
    return // Server-side: không làm gì
  }

  // Client-side: Lưu vào localStorage (sử dụng key mới, không dùng igl.* prefix)
  try {
    // Lưu theo format mới
    localStorage.setItem('jwtToken', session.tokens.accessToken)
    localStorage.setItem('refreshToken', session.tokens.refreshToken)
    localStorage.setItem('userData', JSON.stringify(session.user))

    console.log('✅ Session saved to localStorage:', {
      userId: session.user.id,
      userName: session.user.userName,
      role: session.user.role,
    })
  } catch (error) {
    console.error('❌ Failed to save session:', error)
  }
}

/**
 * Read session from localStorage
 * Đọc accessToken, refreshToken và user info từ localStorage
 */
export async function readSession(): Promise<AuthSession | null> {
  if (typeof window === 'undefined') {
    return null // Server-side: không có localStorage
  }

  try {
    // Đọc từ localStorage (sử dụng key mới)
    const accessToken = localStorage.getItem('jwtToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userStr = localStorage.getItem('userData')

    if (accessToken && refreshToken && userStr) {
      const user = JSON.parse(userStr) as AuthUser
      console.log('✅ Session loaded from localStorage:', {
        userId: user.id,
        userName: user.userName,
        role: user.role,
      })
      return {
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      }
    }

    return null
  } catch (error) {
    console.error('❌ Failed to read session:', error)
    return null
  }
}

/**
 * Clear session from all storage locations
 */
export async function clearSession(): Promise<void> {
  if (typeof window !== 'undefined') {
    // Client-side: Clear all auth keys
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('isGuest')
    localStorage.removeItem('auth-storage') // Zustand store
  }
}

/**
 * Save guest flag
 */
export function saveGuestFlag(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isGuest', 'true')
  }
}

/**
 * Check if user is in guest mode
 */
export function isGuestMode(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isGuest') === 'true'
  }
  return false
}

/**
 * Helper: Get cookie value by name (client-side only)
 */
function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}
