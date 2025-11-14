import { LoginRequest, LoginResponse } from '@/types/api'

const API_BASE_URL =
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1'

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/Authentication/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Login failed')
  }

  const data: LoginResponse = await response.json()

  if (!data.succeeded) {
    throw new Error(data.message || 'Login failed')
  }

  return data
}

// Store tokens and user info in localStorage
export const storeAuthData = (loginResponse: LoginResponse) => {
  if (typeof window === 'undefined') return

  const { accessToken, refreshToken, ...userData } = loginResponse.data

  localStorage.setItem('jwtToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('userData', JSON.stringify(userData))
}

// Get stored user data
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null

  const userData = localStorage.getItem('userData')
  return userData ? JSON.parse(userData) : null
}

// Get stored token
export const getStoredToken = () => {
  if (typeof window === 'undefined') return null

  return localStorage.getItem('jwtToken')
}

// Clear auth data (logout)
export const clearAuthData = () => {
  if (typeof window === 'undefined') return

  localStorage.removeItem('jwtToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getStoredToken()
}

// Get redirect URL based on role
export const getRedirectUrlByRole = (
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
): string => {
  const roleRedirects: Record<string, string> = {
    Admin: '/pages/admin/dashboard',
    Teacher: '/teacher',
    Student: '/student',
  }

  return roleRedirects[role] || '/'
}
