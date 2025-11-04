export const API_BASE_URL =
  'https://igcse-learninghub-api-ajbhg7anb8cfcaa2.southeastasia-01.azurewebsites.net/api/v1'

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('jwtToken')
}

// Generic fetch function with authentication
export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: '*/*',
  }

  // Add any additional headers from options
  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers[key] = value
      }
    })
  }

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/login'
      }
      throw new Error('Authentication failed. Please login again.')
    }

    const errorData = await response.json().catch(() => null)
    throw new Error(
      errorData?.message || `Request failed with status ${response.status}`
    )
  }

  return response.json()
}

// GET request
export const get = async <T>(endpoint: string): Promise<T> => {
  return fetchWithAuth<T>(endpoint, { method: 'GET' })
}

// POST request
export const post = async <T>(endpoint: string, data: any): Promise<T> => {
  return fetchWithAuth<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PUT request
export const put = async <T>(endpoint: string, data: any): Promise<T> => {
  return fetchWithAuth<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// DELETE request
export const del = async <T>(endpoint: string): Promise<T> => {
  return fetchWithAuth<T>(endpoint, { method: 'DELETE' })
}
