import { fetchWithAuth } from './api'

// Enrollment type based on API response
export interface Enrollment {
  enrollmentId: number
  accountId: number
  accountUserName: string
  courseId: number
  courseTitle: string
  enrollmentDate: string
  status: string // "Active" or "Inactive"
}

// Paginated Enrollment Response
interface EnrollmentResponse {
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
  data: Enrollment[]
  details: null
  errors: null
}

// Get all enrollments with pagination
export const getEnrollments = async (
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<EnrollmentResponse> => {
  return fetchWithAuth<EnrollmentResponse>(
    `/admin/enrollments?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get enrollments by course ID
export const getEnrollmentsByCourse = async (
  courseId: number,
  pageNumber: number = 1,
  pageSize: number = 20
): Promise<EnrollmentResponse> => {
  return fetchWithAuth<EnrollmentResponse>(
    `/admin/enrollments?courseId=${courseId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Create enrollment
export const createEnrollment = async (data: {
  accountId: number
  courseId: number
  status: number
}): Promise<number> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: number // Returns the new enrollment ID
    details: null
    errors: null
  }>(`/admin/enrollments`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to create enrollment')
  }

  return response.data // Returns the new enrollment ID
}

// Update enrollment status
export const updateEnrollmentStatus = async (
  enrollmentId: number,
  status: number
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/admin/enrollments/${enrollmentId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to update enrollment')
  }

  return response.data
}

// Delete enrollment
export const deleteEnrollment = async (
  enrollmentId: number
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/admin/enrollments/${enrollmentId}`, {
    method: 'DELETE',
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to delete enrollment')
  }

  return response.data
}

// Helper function to get status label
export const getStatusLabel = (status: string): string => {
  return status
}

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  return status === 'Active'
    ? 'bg-green-100 text-green-700'
    : 'bg-gray-100 text-gray-700'
}
