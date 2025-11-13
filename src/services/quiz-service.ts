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
    pageNumber?: number, 
    pageSize?: number
  ): Promise<ApiResponse<QuizSummary[]>> {
    const params = new URLSearchParams({
      courseId: courseId.toString()
    })
    if (pageNumber) params.append('pageNumber', pageNumber.toString())
    if (pageSize) params.append('pageSize', pageSize.toString())
    return apiClient.get<ApiResponse<QuizSummary[]>>(`/quizzes?${params.toString()}`)
  }

  async getQuizForTake(
    quizId: number, 
    shuffleQuestions?: boolean, 
    shuffleOptions?: boolean
  ): Promise<ApiResponse<QuizForTake>> {
    const params = new URLSearchParams()
    if (shuffleQuestions !== undefined) params.append('shuffleQuestions', shuffleQuestions.toString())
    if (shuffleOptions !== undefined) params.append('shuffleOptions', shuffleOptions.toString())
    const queryString = params.toString()
    return apiClient.get<ApiResponse<QuizForTake>>(`/student/quizzes/${quizId}/for-take${queryString ? `?${queryString}` : ''}`)
  }

  async createQuizAttempt(quizId: number): Promise<ApiResponse<number>> {
    return apiClient.post<ApiResponse<number>>(`/student/quizzes/${quizId}/attempts`)
  }

  async submitQuizAttempt(
    quizId: number, 
    attemptId: number, 
    submission: QuizSubmission
  ): Promise<ApiResponse<QuizAttemptResult>> {
    return apiClient.post<ApiResponse<QuizAttemptResult>>(`/student/quizzes/${quizId}/attempts/${attemptId}/submit`, submission)
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