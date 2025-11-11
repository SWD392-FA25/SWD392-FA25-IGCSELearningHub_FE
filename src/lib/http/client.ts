/**
 * HTTP Client
 * Fetch wrapper with automatic token injection and error handling
 */

import { config } from '@/lib/config'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

interface FetchOptions extends RequestInit {
  baseURL?: string
  token?: string
}

/**
 * Get access token from storage
 * Works in both client and server contexts
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    // Server-side: cookies are handled by middleware
    return null
  }
  // Client-side: read from localStorage (new Zustand store or old jwtToken)
  try {
    // Try Zustand store first
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      const parsed = JSON.parse(authStorage)
      return parsed.state?.accessToken || null
    }

    // Fallback to old jwtToken key
    return localStorage.getItem('jwtToken')
  } catch {
    return null
  }
}

/**
 * Enhanced fetch with automatic token injection and error handling
 */
export async function httpClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    baseURL = config.apiBaseUrl,
    token,
    headers: customHeaders,
    ...restOptions
  } = options

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  // Get token from storage if not provided
  const accessToken = token || getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  // Add Authorization header if token exists
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers,
    })

    // Parse response body
    let data: unknown
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Handle HTTP errors
    if (!response.ok) {
      // Handle 401/403 - Unauthorized/Forbidden
      if (response.status === 401 || response.status === 403) {
        if (typeof window !== 'undefined') {
          // Client-side: trigger sign out - clear all auth data
          localStorage.removeItem('auth-storage') // Zustand store
          localStorage.removeItem('jwtToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userData')
          window.location.href = '/login'
        }
      }

      // Extract error message from response
      const errorMessage =
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as Record<string, unknown>).message === 'string'
          ? (data as Record<string, unknown>).message
          : `HTTP ${response.status}: ${response.statusText}`

      throw new AppError(
        errorMessage as string,
        response.status,
        response.status.toString()
      )
    }

    return data as T
  } catch (error) {
    // Network errors or other failures
    if (error instanceof AppError) {
      throw error
    }

    throw new AppError(
      error instanceof Error ? error.message : 'Network request failed',
      undefined,
      'NETWORK_ERROR'
    )
  }
}

// Convenience methods
export const http = {
  get: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ) =>
    httpClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ) =>
    httpClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    httpClient<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: FetchOptions
  ) =>
    httpClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
}
