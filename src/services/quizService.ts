import { fetchWithAuth } from './api'

// Quiz type based on API response
export interface Quiz {
  id: number
  courseId: number
  title: string
  totalQuestions: number
  createdAt: string
  randomizeQuestions?: boolean
  randomizeOptions?: boolean
}

// Question Option
export interface QuestionOption {
  text: string
  isCorrect: boolean
}

// Question
export interface Question {
  stem: string
  explanation: string
  difficulty: number
  type: 'MultipleChoice' | 'TrueFalse' | 'ShortAnswer'
  points: number
  options: QuestionOption[]
}

// Quiz Detail (with questions)
export interface QuizDetail extends Quiz {
  questions: Question[]
}

// Paginated Quiz Response
interface QuizResponse {
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
  data: Quiz[]
  details: null
  errors: null
}

// Single Quiz Response
interface SingleQuizResponse {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: QuizDetail
  details: null
  errors: null
}

// Get all quizzes with pagination
export const getQuizzes = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<QuizResponse> => {
  return fetchWithAuth<QuizResponse>(
    `/Quizzes?pageNumber=${pageNumber}&pageSize=${pageSize}`
  )
}

// Get single quiz by ID
export const getQuizById = async (id: number): Promise<QuizDetail> => {
  const response = await fetchWithAuth<SingleQuizResponse>(`/Quizzes/${id}`)
  return response.data
}

// Create quiz
export const createQuiz = async (data: {
  courseId: number
  title: string
  timeLimitSeconds: number
  randomizeQuestions: boolean
  randomizeOptions: boolean
  questions: Question[]
}): Promise<number> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: number
    details: null
    errors: null
  }>(`/Quizzes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to create quiz')
  }

  return response.data
}

// Update quiz
export const updateQuiz = async (
  id: number,
  data: {
    courseId: number
    title: string
    timeLimitSeconds: number
    randomizeQuestions: boolean
    randomizeOptions: boolean
    questions: Question[]
  }
): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/Quizzes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to update quiz')
  }

  return response.data
}

// Delete quiz
export const deleteQuiz = async (id: number): Promise<boolean> => {
  const response = await fetchWithAuth<{
    succeeded: boolean
    status: string
    statusCode: number
    message: string
    data: boolean
    details: null
    errors: null
  }>(`/Quizzes/${id}`, {
    method: 'DELETE',
  })

  if (!response.succeeded) {
    throw new Error(response.message || 'Failed to delete quiz')
  }

  return response.data
}
