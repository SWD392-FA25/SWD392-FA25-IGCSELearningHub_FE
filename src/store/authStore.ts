import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  id: number
  userName: string
  fullName: string
  email: string
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
  status: 'Active' | 'Inactive'
  isExternal: boolean
}

interface AuthState {
  // State
  accessToken: string | null
  refreshToken: string | null
  user: UserData | null
  isAuthenticated: boolean

  // Actions
  setAuth: (accessToken: string, refreshToken: string, user: UserData) => void
  clearAuth: () => void
  updateUser: (user: Partial<UserData>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // Set authentication data after login
      setAuth: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      // Clear authentication data (logout)
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      // Update user data
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage', // localStorage key
      // Only persist these fields
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selectors
export const useAccessToken = () => useAuthStore((state) => state.accessToken)
export const useRefreshToken = () => useAuthStore((state) => state.refreshToken)
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated)

// Get redirect URL based on role
export const getRedirectUrlByRole = (
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
): string => {
  const roleRedirects: Record<string, string> = {
    Admin: '/pages/admin/dashboard',
    Teacher: '/pages/teacher/dashboard',
    Student: '/pages/student/dashboard',
    Parent: '/pages/parent/dashboard',
  }

  return roleRedirects[role] || '/'
}
