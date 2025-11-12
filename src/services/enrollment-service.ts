import { apiClient } from './api-client'
import { ApiResponse, PaginatedApiResponse, Enrollment, EnrollmentDetail } from '@/types/api-types'

class EnrollmentService {
  // GET /api/v1/me/enrollments - Get my enrollments with pagination
  async getMyEnrollments(pageNumber: number = 1, pageSize: number = 20): Promise<PaginatedApiResponse<Enrollment[]>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    })
    return apiClient.get<PaginatedApiResponse<Enrollment[]>>(`/me/enrollments?${params.toString()}`)
  }

  // GET /api/v1/me/enrollments/{id} - Get enrollment by ID
  async getEnrollmentById(enrollmentId: number): Promise<ApiResponse<EnrollmentDetail>> {
    return apiClient.get<ApiResponse<EnrollmentDetail>>(`/me/enrollments/${enrollmentId}`)
  }

  // Mark lesson as completed (if available)
  async markLessonCompleted(enrollmentId: string, lessonId: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/me/enrollments/${enrollmentId}/lessons/${lessonId}/complete`)
  }

  // Submit quiz (if available)
  async submitQuiz(enrollmentId: string, quizId: string, answers: any[]): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/me/enrollments/${enrollmentId}/quizzes/${quizId}/submit`, {
      answers
    })
  }

  // Submit assignment (if available)
  async submitAssignment(enrollmentId: string, assignmentId: string, submission: any): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/me/enrollments/${enrollmentId}/assignments/${assignmentId}/submit`, submission)
  }
}

export const enrollmentService = new EnrollmentService()