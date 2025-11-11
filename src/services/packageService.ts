import { fetchWithAuth } from './api'

// Package type based on API response
export interface Package {
  id: number
  name: string
  price: number
  courseCount: number
  createdAt: string
}

// Paginated Package Response
interface PackageResponse {
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
  data: Package[]
  details: null
  errors: null
}

// Get all packages with pagination
export const getPackages = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PackageResponse> => {
  return fetchWithAuth<PackageResponse>(
    `/admin/packages?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get single package by ID
export const getPackageById = async (id: number): Promise<Package> => {
  return fetchWithAuth<Package>(`/admin/packages/${id}`)
}

// Create package
export const createPackage = async (data: {
  name: string
  price: number
  courseIds: number[]
}): Promise<Package> => {
  return fetchWithAuth<Package>(`/admin/packages`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// Update package
export const updatePackage = async (
  id: number,
  data: {
    name: string
    price: number
    courseIds: number[]
  }
): Promise<Package> => {
  return fetchWithAuth<Package>(`/admin/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// Delete package
export const deletePackage = async (id: number): Promise<void> => {
  return fetchWithAuth<void>(`/admin/packages/${id}`, {
    method: 'DELETE',
  })
}
