/**
 * Authentication Types
 * All type definitions for auth-related data structures
 */

export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface AuthUser {
  id: number
  userName: string
  fullName: string
  email: string
  role: string
  status: string
  isExternal: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: AuthUser
  tokens: AuthTokens
}

export interface AuthSession {
  user: AuthUser
  tokens: AuthTokens
}

// Backend API response structure
export interface BackendAuthResponse {
  data: {
    accessToken: string
    refreshToken: string
    id: number
    userName: string
    fullName: string
    email: string
    role: string
    status: string
    isExternal: boolean
  }
}
