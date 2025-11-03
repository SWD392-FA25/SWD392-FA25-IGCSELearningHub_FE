// API Response Types

export interface ApiResponse<T> {
  succeeded: boolean
  status: string
  statusCode: number
  message: string
  data: T
  details?: any
  errors?: any
}

// Auth & Account Types
export interface LoginData {
  jwtToken: string
  id: number
  userName: string
  fullName: string
  email: string
  role: string
  status: string
  isExternal: boolean
}

export interface AccountDetail {
  id: number
  userName: string
  fullName: string
  email: string
  phoneNumber: string
  role: string
  status: string
  isExternal: boolean
  externalProvider: string | null
  createdAt: string
}

// Course Types (API public shapes)
export interface CourseSummary {
  id: number
  title: string
  level: string
  price: number
  shortDescription?: string
  totalQuizzes: number
  totalAssignments: number
}

export interface CourseDetail {
  id: number
  title: string
  description?: string
  level: string
  price: number
  totalQuizzes: number
  totalAssignments: number
  totalLivestreams?: number
}

// Backwards-compatible (internal) Course type retained for other parts of the app that need richer data
export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  price: number
  duration: string
  level: string
  thumbnail?: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Enrollment Types
export interface Enrollment {
  id: string
  courseId: string
  course: Course
  enrolledAt: string
  completedAt?: string
  progress: number
  status: 'active' | 'completed' | 'cancelled'
  currentLesson?: number
}

export interface EnrollmentDetail extends Enrollment {
  lessons: Lesson[]
  quizzes: Quiz[]
  assignments: Assignment[]
}

export interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  duration: number
  isCompleted: boolean
  completedAt?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  totalQuestions: number
  duration: number
  attempts: number
  bestScore?: number
  isCompleted: boolean
  completedAt?: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  submittedAt?: string
  grade?: number
  feedback?: string
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
}

// Order Types
export interface Order {
  id: string
  courseId: string
  course: Course
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  updatedAt: string
  paymentMethod?: string
  transactionId?: string
}

export interface OrderDetail extends Order {
  orderItems: OrderItem[]
  billingAddress?: BillingAddress
  paymentHistory: PaymentHistory[]
}

export interface OrderItem {
  id: string
  courseId: string
  courseName: string
  price: number
  quantity: number
}

export interface BillingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
}

export interface PaymentHistory {
  id: string
  amount: number
  status: string
  paymentMethod: string
  transactionId: string
  createdAt: string
}

export interface OrderStatus {
  orderId: string
  status: string
  message: string
  paymentUrl?: string
  expiresAt?: string
}

export interface CheckoutRequest {
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer'
  billingAddress?: BillingAddress
}

export interface CheckoutResponse {
  orderId: string
  paymentUrl: string
  expiresAt: string
  status: string
}