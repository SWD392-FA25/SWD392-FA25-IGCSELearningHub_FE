export type ApiResponse<T> = { data: T; message?: string }

// Paginated API Response
export interface PaginatedResponse<T> {
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: T[]
  details: null
  errors: null
}

// User/Account types
export interface User {
  id: number
  userName: string
  fullName: string | null
  email: string
  phoneNumber: string | null
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
  status: 'Active' | 'Inactive'
  isExternal: boolean
  externalProvider: string | null
  createdAt: string
}

export type Student = User
export type Parent = User
export type Teacher = User

// Course type
export interface Course {
  id: number
  title: string
  level: string
  price: number
  createdAt: string
}

// Authentication types
export interface LoginRequest {
  emailOrUsername: string
  password: string
}

export interface LoginResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: {
    accessToken: string
    refreshToken: string
    id: number
    userName: string
    fullName: string
    email: string
    role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
    status: 'Active' | 'Inactive'
    isExternal: boolean
  }
  details: null
  errors: null
}
