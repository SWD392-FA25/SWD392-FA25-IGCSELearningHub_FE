import { apiClient } from './api-client'
import { ApiResponse, Enrollment, EnrollmentDetail } from '@/types/api-types'

class EnrollmentService {
  // GET /api/v1/me/enrollments - Get my enrollments
  async getMyEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    return apiClient.get<ApiResponse<Enrollment[]>>('/me/enrollments')
  }

  // GET /api/v1/me/enrollments/{id} - Get enrollment by ID
  async getEnrollmentById(enrollmentId: string): Promise<ApiResponse<EnrollmentDetail>> {
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