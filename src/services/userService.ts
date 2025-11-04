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

// Get accounts by role
export const getAccountsByRole = async (
  role: 'Admin' | 'Teacher' | 'Student' | 'Parent'
): Promise<User[]> => {
  const allUsers = await getAllAccounts()
  return allUsers.filter((user) => user.role === role)
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
