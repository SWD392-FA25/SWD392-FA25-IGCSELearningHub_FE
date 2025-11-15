// API utility with authentication support
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1'

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

/**
 * Fetch wrapper with automatic authentication token injection
 */
export async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options

  // Build URL with query parameters if provided
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value)
        return acc
      }, {} as Record<string, string>)
    ).toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // Get token from storage (check both 'token' and 'jwtToken')
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('jwtToken') || localStorage.getItem('token')
    : null

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((fetchOptions.headers as Record<string, string>) || {}),
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    // Handle unauthorized
    if (response.status === 401) {
      // Clear auth data and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userData')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      throw new Error('Unauthorized')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean>) =>
    fetchWithAuth<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any) =>
    fetchWithAuth<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any) =>
    fetchWithAuth<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any) =>
    fetchWithAuth<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    fetchWithAuth<T>(endpoint, { method: 'DELETE' }),
}
