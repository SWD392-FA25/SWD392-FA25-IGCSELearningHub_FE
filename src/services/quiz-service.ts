import { apiClient } from './api-client'
import { 
  ApiResponse, 
  PaginatedApiResponse, 
  QuizSummary, 
  QuizForTake, 
  QuizAttempt, 
  QuizSubmission, 
  QuizAttemptResult 
} from '@/types/api-types'

class QuizService {
  async getQuizzesByCourse(
    courseId: number, 
    pageNumber: number = 1, 
    pageSize: number = 10
  ): Promise<PaginatedApiResponse<QuizSummary[]>> {
    const params = new URLSearchParams({
      courseId: courseId.toString(),
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    })
    return apiClient.get<PaginatedApiResponse<QuizSummary[]>>(`/quizzes?${params.toString()}`)
  }

  async getQuizForTake(quizId: number): Promise<ApiResponse<QuizForTake>> {
    return apiClient.get<ApiResponse<QuizForTake>>(`/student/quizzes/${quizId}/for-take`)
  }

  async createQuizAttempt(quizId: number): Promise<ApiResponse<{ attemptId: number }>> {
    return apiClient.post<ApiResponse<{ attemptId: number }>>(`/student/quizzes/${quizId}/attempts`)
  }

  async submitQuizAttempt(
    quizId: number, 
    attemptId: number, 
    submission: QuizSubmission
  ): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/student/quizzes/${quizId}/attempts/${attemptId}/submit`, submission)
  }

  async getQuizAttemptResult(
    quizId: number, 
    attemptId: number
  ): Promise<ApiResponse<QuizAttemptResult>> {
    return apiClient.get<ApiResponse<QuizAttemptResult>>(`/student/quizzes/${quizId}/attempts/${attemptId}`)
  }

  async getQuizAttempts(
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedApiResponse<QuizAttempt[]>> {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString()
    })
    return apiClient.get<PaginatedApiResponse<QuizAttempt[]>>(`/student/quiz-attempts?${params.toString()}`)
  }
}

export const quizService = new QuizService()