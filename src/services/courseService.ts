import { fetchWithAuth } from './api'

// Course type based on API response
export interface Course {
  id: number
  title: string
  level: string
  price: number
  shortDescription: string
  totalQuizzes: number
  totalAssignments: number
  // Additional fields for UI (will come from BE later)
  students?: number
  teacher?: string
  status?: 'Active' | 'Disabled'
  progress?: number
}

// Paginated Course Response
interface CourseResponse {
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
  data: Course[]
  details: null
  errors: null
}

// Get all courses with pagination
export const getCourses = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<CourseResponse> => {
  return fetchWithAuth<CourseResponse>(
    `/courses?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get single course by ID
export const getCourseById = async (id: number): Promise<Course> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: Course
    details: null
    errors: null
  }>(`/courses/${id}`)
  
  return response.data
}

// Delete course
export const deleteCourse = async (id: number): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean // Returns true if deleted
    details: null
    errors: null
  }>(`/admin/courses/${id}`, {
    method: 'DELETE',
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to delete course')
  }

  return response.data
}

// Create course
export const createCourse = async (data: {
  title: string
  description: string
  level: string
  price: number
}): Promise<number> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: number // Returns the new course ID
    details: null
    errors: null
  }>(`/admin/courses`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to create course')
  }

  return response.data // Returns the new course ID
}

// Update course
export const updateCourse = async (
  id: number,
  data: {
    title: string
    description: string
    level: string
    price: number
  }
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean // Returns true if updated
    details: null
    errors: null
  }>(`/admin/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to update course')
  }

  return response.data
}
