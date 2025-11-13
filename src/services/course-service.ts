import { apiClient } from './api-client'
import { ApiResponse, PaginatedApiResponse, CourseSummary, CourseDetail } from '@/types/api-types'

interface SearchCoursesParams {
  q?: string;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  pageNumber?: number;
  pageSize?: number;
}

class CourseService {
  // GET /api/v1/courses - Get all public courses
  async getAllCourses(): Promise<ApiResponse<CourseSummary[]>> {
    return apiClient.get<ApiResponse<CourseSummary[]>>('/courses')
  }

  // GET /api/v1/courses/{id} - Get course by ID
  async getCourseById(courseId: string): Promise<ApiResponse<CourseDetail>> {
    return apiClient.get<ApiResponse<CourseDetail>>(`/courses/${courseId}`)
  }

  // Search courses with filters and pagination
  async searchCourses(params: SearchCoursesParams): Promise<PaginatedApiResponse<CourseSummary[]>> {
    const queryParams = new URLSearchParams()
    
    if (params.q) queryParams.append('q', params.q)
    if (params.level) queryParams.append('level', params.level)
    if (params.priceMin !== undefined) queryParams.append('priceMin', params.priceMin.toString())
    if (params.priceMax !== undefined) queryParams.append('priceMax', params.priceMax.toString())
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.pageNumber) queryParams.append('pageNumber', params.pageNumber.toString())
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString())
    
    const queryString = queryParams.toString()
    return apiClient.get<PaginatedApiResponse<CourseSummary[]>>(`/courses${queryString ? `?${queryString}` : ''}`)
  }
}

export const courseService = new CourseService()