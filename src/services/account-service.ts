// Account service for fetching and updating user account details
import { ApiResponse, AccountDetail } from '@/types/api-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface UpdateAccountRequest {
  fullName: string
  phoneNumber: string
  userName: string
  email: string // Not editable but required in request
}

class AccountService {
  async getAccountById(id: number, token: string): Promise<ApiResponse<AccountDetail>> {
    try {
      const response = await fetch(`${API_BASE_URL}/Accounts/${id}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Get account error:', error)
      return {
        succeeded: false,
        status: "error",
        statusCode: 500,
        message: "Failed to fetch account details",
        data: null as any,
        details: null,
        errors: ["Network error or server is down"]
      }
    }
  }

  async updateAccount(id: number, data: UpdateAccountRequest, token: string): Promise<ApiResponse<AccountDetail>> {
    try {
      const response = await fetch(`${API_BASE_URL}/Accounts/${id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Update account error:', error)
      return {
        succeeded: false,
        status: "error",
        statusCode: 500,
        message: "Failed to update account",
        data: null as any,
        details: null,
        errors: ["Network error or server is down"]
      }
    }
  }
}

export const accountService = new AccountService()
