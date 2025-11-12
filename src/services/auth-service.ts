// Authentication service
import { ApiResponse, LoginData, AccountDetail } from '@/types/api-types'
import { accountService } from './account-service'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  userName: string
  fullName: string
  email: string
  password: string
  phoneNumber: string
  address?: string
  role?: string
}

export interface AuthResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: any
  details?: any
  errors?: string[] | null
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Authentication/login`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrUsername: credentials.username,
          password: credentials.password,
        }),
      })

      const data: ApiResponse<LoginData> = await response.json()
      
      // Save token and fetch full profile if login successful
      if (data.succeeded && data.data?.accessToken && data.data?.id) {
        if (typeof window !== 'undefined') {
          // Save JWT token
          localStorage.setItem('token', data.data.accessToken)
          localStorage.setItem('userId', data.data.id.toString())
          
          // Fetch full account details using the id
          const accountResponse = await accountService.getAccountById(data.data.id, data.data.accessToken)
          
          if (accountResponse.succeeded && accountResponse.data) {
            // Save full user profile
            localStorage.setItem('user', JSON.stringify(accountResponse.data))
          } else {
            // Fallback: save basic user info from login response
            localStorage.setItem('user', JSON.stringify(data.data))
          }
        }
      }

      return data
    } catch (error) {
      console.error('Login error:', error)
      return {
        succeeded: false,
        status: "error",
        statusCode: 500,
        message: "Failed to connect to authentication service",
        data: null,
        details: null,
        errors: ["Network error or server is down"]
      }
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Authentication/register`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userData.userName,
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          address: userData.address || "",
          role: userData.role || "Student",
          isExternal: false,
          externalProvider: ""
        }),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Register error:', error)
      return {
        succeeded: false,
        status: "error",
        statusCode: 500,
        message: "Failed to connect to registration service",
        data: null,
        details: null,
        errors: ["Network error or server is down"]
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  getUser(): any {
    if (typeof window === 'undefined') return null
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
