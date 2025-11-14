import { fetchWithAuth } from "./api"

export interface AccountDetail {
  id: number
  userName: string
  fullName: string
  email: string
  phoneNumber: string
  gender: "male" | "female" | "other"
  role: "Admin" | "Teacher" | "Student" | "Parent"
  status: "Active" | "Inactive"
  isExternal: boolean
  externalProvider: string
  createdAt: string
}

export interface AccountResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: AccountDetail
  details: any
  errors: any
}

/**
 * Get account details by ID
 */
export const getAccountById = async (accountId: number): Promise<AccountDetail> => {
  const response = await fetchWithAuth(`/Accounts/${accountId}`, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch account details")
  }

  const result: AccountResponse = await response.json()
  return result.data
}
