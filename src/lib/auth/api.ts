/**
 * Auth API
 * Authentication-related API calls
 */

import { http } from '@/lib/http/client'
import type { AuthResponse, BackendAuthResponse, LoginRequest } from './types'

/**
 * Map backend response to frontend AuthResponse
 */
function toAuthResponse(res: BackendAuthResponse): AuthResponse {
  return {
    user: {
      id: res.data.id,
      userName: res.data.userName,
      fullName: res.data.fullName,
      email: res.data.email,
      role: res.data.role,
      status: res.data.status,
      isExternal: res.data.isExternal,
    },
    tokens: {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
    },
  }
}

/**
 * Login with email/username and password
 */
export async function login(req: LoginRequest): Promise<AuthResponse> {
  const response = await http.post<BackendAuthResponse>(
    '/Authentication/login',
    req
  )
  return toAuthResponse(response)
}

/**
 * Login with Google ID Token
 */
export async function googleLogin(
  googleIdToken: string
): Promise<AuthResponse> {
  const response = await http.post<BackendAuthResponse>(
    '/Authentication/google-login',
    { idToken: googleIdToken },
    {
      headers: {
        Authorization: `Bearer ${googleIdToken}`,
      },
    }
  )
  return toAuthResponse(response)
}

/**
 * Refresh access token using refresh token
 * (Optional - implement if backend supports)
 */
export async function refreshToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await http.post<BackendAuthResponse>(
    '/Authentication/refresh',
    { refreshToken }
  )
  return toAuthResponse(response)
}
