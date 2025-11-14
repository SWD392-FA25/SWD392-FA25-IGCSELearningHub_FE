import { fetchWithAuth } from './api'

// Assignment type based on API response
export interface Assignment {
  id: number
  courseId: number
  title: string
  createdAt: string
  submissionCount: number
  // Optional fields for UI
  description?: string
}

// Submission type based on API response
export interface Submission {
  submissionId: number
  assignmentId?: number
  accountId: number
  accountUserName: string
  score: number | null
  submittedDate: string
}

// Paginated Submission Response
interface SubmissionResponse {
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
  data: Submission[]
  details: null
  errors: null
}

// Paginated Assignment Response
interface AssignmentResponse {
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
  data: Assignment[]
  details: null
  errors: null
}

// Get all assignments with pagination
export const getAssignments = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<AssignmentResponse> => {
  return fetchWithAuth<AssignmentResponse>(
    `/admin/assignments?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get single assignment by ID
export const getAssignmentById = async (id: number): Promise<Assignment> => {
  return fetchWithAuth<Assignment>(`/admin/assignments/${id}`)
}

// Create assignment
export const createAssignment = async (data: {
  courseId: number
  title: string
  description: string
}): Promise<number> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: number // Returns the new assignment ID
    details: null
    errors: null
  }>(`/admin/assignments`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to create assignment')
  }

  return response.data // Returns the new assignment ID
}

// Update assignment
export const updateAssignment = async (
  id: number,
  data: {
    title: string
    description: string
  }
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/admin/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to update assignment')
  }

  return response.data
}

// Delete assignment
export const deleteAssignment = async (id: number): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/admin/assignments/${id}`, {
    method: 'DELETE',
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to delete assignment')
  }

  return response.data
}

// Get submissions for an assignment
export const getSubmissionsByAssignment = async (
  assignmentId: number,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<SubmissionResponse> => {
  return fetchWithAuth<SubmissionResponse>(
    `/admin/assignments/${assignmentId}/submissions?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get single submission by ID
export const getSubmissionById = async (
  submissionId: number
): Promise<Submission> => {
  return fetchWithAuth<Submission>(
    `/admin/submissions/${submissionId}`
  )
}

// Grade a submission
export const gradeSubmission = async (
  submissionId: number,
  score: number
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/admin/submissions/${submissionId}/grade`, {
    method: 'PATCH',
    body: JSON.stringify({ score }),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to grade submission')
  }

  return response.data
}
