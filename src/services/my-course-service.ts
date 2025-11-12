import { apiClient } from './api-client'
import { ApiResponse, MyCourseDetail, LessonDetail } from '@/types/api-types'

class MyCourseService {
  // GET /api/v1/me/courses/{courseId} - Get my course details
  async getMyCourseById(courseId: number): Promise<ApiResponse<MyCourseDetail>> {
    return apiClient.get<ApiResponse<MyCourseDetail>>(`/me/courses/${courseId}`)
  }

  // GET /api/v1/me/courses/{courseId}/lessons/{lessonId} - Get lesson details
  async getLessonById(courseId: number, lessonId: number): Promise<ApiResponse<LessonDetail>> {
    return apiClient.get<ApiResponse<LessonDetail>>(`/me/courses/${courseId}/lessons/${lessonId}`)
  }

  // PATCH /api/v1/me/courses/{courseId}/lessons/{lessonId}/complete - Mark lesson as completed
  async markLessonCompleted(courseId: number, lessonId: number): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>(`/me/courses/${courseId}/lessons/${lessonId}/complete`)
  }

  // Helper method to mark lesson as incomplete (if needed)
  async markLessonIncomplete(courseId: number, lessonId: number): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>(`/me/courses/${courseId}/lessons/${lessonId}/incomplete`)
  }

  async getCourseProgress(courseId: number): Promise<ApiResponse<{ completedPercent: number }>> {
    return apiClient.get<ApiResponse<{ completedPercent: number }>>(`/me/courses/${courseId}/progress`)
  }

  async updateCourseProgress(courseId: number, completedPercent: number): Promise<ApiResponse<any>> {
    return apiClient.patch<ApiResponse<any>>(`/me/courses/${courseId}/progress`, { completedPercent })
  }
}

export const myCourseService = new MyCourseService()