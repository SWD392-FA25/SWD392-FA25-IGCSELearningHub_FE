import { fetchWithAuth } from './api'

// Livestream type based on API response
export interface Livestream {
  id: number
  courseId: number
  teacherId: number
  title: string
  schedule: string
  price: number
  registrationCount: number
}

// Paginated Livestream Response
interface LivestreamResponse {
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
  data: Livestream[]
  details: null
  errors: null
}

// Get all livestreams with pagination
export const getLivestreams = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<LivestreamResponse> => {
  return fetchWithAuth<LivestreamResponse>(
    `/admin/livestreams?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get single livestream by ID
export const getLivestreamById = async (id: number): Promise<Livestream> => {
  return fetchWithAuth<Livestream>(`/admin/livestreams/${id}`)
}

// Create livestream
export const createLivestream = async (data: {
  courseId: number
  teacherId: number
  title: string
  schedule: string
  price: number
}): Promise<Livestream> => {
  return fetchWithAuth<Livestream>(`/admin/livestreams`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Update livestream
export const updateLivestream = async (
  id: number,
  data: Partial<Livestream>
): Promise<Livestream> => {
  return fetchWithAuth<Livestream>(`/admin/livestreams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Delete livestream
export const deleteLivestream = async (id: number): Promise<void> => {
  return fetchWithAuth<void>(`/admin/livestreams/${id}`, {
    method: 'DELETE',
  })
}

// Get livestreams by teacher ID
export const getLivestreamsByTeacherId = async (
  teacherId: number,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<LivestreamResponse> => {
  return fetchWithAuth<LivestreamResponse>(
    `/admin/livestreams?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}
