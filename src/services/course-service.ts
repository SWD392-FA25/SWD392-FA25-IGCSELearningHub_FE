import { apiClient } from './api-client'
import { ApiResponse, CourseSummary, CourseDetail } from '@/types/api-types'

class CourseService {
  // GET /api/v1/courses - Get all public courses
  async getAllCourses(): Promise<ApiResponse<CourseSummary[]>> {
    return apiClient.get<ApiResponse<CourseSummary[]>>('/courses')
  }

  // GET /api/v1/courses/{id} - Get course by ID
  async getCourseById(courseId: string): Promise<ApiResponse<CourseDetail>> {
    return apiClient.get<ApiResponse<CourseDetail>>(`/courses/${courseId}`)
  }

  // Search courses (if available)
  async searchCourses(query: string, category?: string, level?: string): Promise<ApiResponse<CourseSummary[]>> {
    const params = new URLSearchParams()
    if (query) params.append('q', query)
    if (category) params.append('category', category)
    if (level) params.append('level', level)
    
    const queryString = params.toString()
    return apiClient.get<ApiResponse<CourseSummary[]>>(`/courses${queryString ? `?${queryString}` : ''}`)
  }
}

export const courseService = new CourseService()