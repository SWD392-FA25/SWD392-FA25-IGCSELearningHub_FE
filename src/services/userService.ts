import { PaginatedResponse, User } from '@/types/api'
import { fetchWithAuth } from './api'

// Get all accounts (without pagination based on your API response)
export const getAllAccounts = async (): Promise<User[]> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: User[]
    details: null
    errors: null
  }>(`/Accounts`)

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to fetch accounts')
  }

  return response.data
}

// Get all accounts with pagination
export const getAccounts = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<User>> => {
  return fetchWithAuth<PaginatedResponse<User>>(
    `/Accounts?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get accounts by role (returns all users of that role)
export const getAccountsByRole = async (
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
): Promise<User[]> => {
  const allUsers = await getAllAccounts()
  return allUsers.filter((user) => user.role === role)
}

// Get accounts by role with client-side pagination
export const getAccountsByRolePaginated = async (
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent',
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<User>> => {
  // Get all users of this role
  const allUsers = await getAccountsByRole(role)

  // Calculate pagination
  const totalCount = allUsers.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = allUsers.slice(startIndex, endIndex)

  // Return paginated response
  return {
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasNext: pageNumber < totalPages,
    hasPrevious: pageNumber > 1,
    succeeded: true,
    status: 'success',
    statusCode: 200,
    message: `Retrieved ${paginatedData.length} ${role.toLowerCase()}s`,
    data: paginatedData,
    details: null,
    errors: null,
  }
}

// Convenience functions for specific roles with pagination
export const getStudents = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<User>> => {
  return getAccountsByRolePaginated('Student', pageNumber, pageSize)
}

export const getTeachers = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<User>> => {
  return getAccountsByRolePaginated('Teacher', pageNumber, pageSize)
}

export const getParents = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse<User>> => {
  return getAccountsByRolePaginated('Parent', pageNumber, pageSize)
}

// Get single account by ID
export const getAccountById = async (id: number): Promise<User> => {
  return fetchWithAuth<User>(`/Accounts/${id}`)
}

// Delete account
export const deleteAccount = async (id: number): Promise<void> => {
  return fetchWithAuth<void>(`/Accounts/${id}`, {
    method: 'DELETE',
  })
}

// Create account
export const createAccount = async (data: Partial<User>): Promise<User> => {
  return fetchWithAuth<User>(`/Accounts`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Update account
export const updateAccount = async (
  id: number,
  data: Partial<User>
): Promise<User> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: User
    details: null
    errors: null
  }>(`/Accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to update account')
  }

  return response.data
}
