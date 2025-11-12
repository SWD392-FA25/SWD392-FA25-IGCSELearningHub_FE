// API Response Types

export interface ApiResponse<T> {
  succeeded: boolean;
  status: string;
  statusCode: number;
  message: string;
  data: T;
  details?: any;
  errors?: any;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Auth & Account Types
export interface LoginData {
  accessToken: string;
  id: number;
  userName: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isExternal: boolean;
}

export interface AccountDetail {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
  isExternal: boolean;
  externalProvider: string | null;
  createdAt: string;
}

// Course Types (API public shapes)
export interface CourseSummary {
  id: number;
  title: string;
  level: string;
  price: number;
  shortDescription?: string;
  totalQuizzes: number;
  totalAssignments: number;
}

export interface CourseDetail {
  id: number;
  title: string;
  description?: string;
  info?: string;
  level: string;
  subjectGroup?: string;
  price: number;
  totalQuizzes: number;
  totalAssignments: number;
  totalLivestreams?: number;
  units?: Unit[];
}

export interface Unit {
  id: number;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: number;
  title: string;
  description?: string;
  order: number;
  isFreePreview: boolean;
  completed: boolean;
  videoUrl?: string | null;
  attachmentUrl?: string | null;
}

// My Course Detail (from /me/courses/{courseId})
export interface MyCourseDetail {
  id: number;
  title: string;
  description?: string;
  info?: string;
  level: string;
  subjectGroup?: string;
  price: number;
  totalQuizzes: number;
  totalAssignments: number;
  totalLivestreams?: number;
  units?: Unit[];
}

// Lesson Detail (from /me/courses/{courseId}/lessons/{lessonId})
export interface LessonDetail {
  lessonId: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl?: string | null;
  attachmentUrl?: string | null;
  orderIndex: number;
  isFreePreview: boolean;
  unitId: number;
  completed: boolean;
}

// Backwards-compatible (internal) Course type retained for other parts of the app that need richer data
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  level: string;
  thumbnail?: string;
  category: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Types
export interface Enrollment {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  enrollmentDate: string;
  status: string;
  completedPercent: number | null;
}

export interface EnrollmentDetail {
  enrollmentId: number;
  courseId: number;
  courseTitle: string;
  courseLevel: string;
  enrollmentDate: string;
  status: string;
  completedPercent: number | null;
  lastAccessDate: string | null;
}

// Legacy enrollment types (kept for backward compatibility)
export interface LegacyEnrollment {
  id: string;
  courseId: string;
  course: Course;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  status: "active" | "completed" | "cancelled";
  currentLesson?: number;
}

export interface LegacyEnrollmentDetail extends LegacyEnrollment {
  lessons: Lesson[];
  quizzes: Quiz[];
  assignments: Assignment[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  totalQuestions: number;
  duration: number;
  attempts: number;
  bestScore?: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  status: "pending" | "submitted" | "graded" | "overdue";
}

// Order Types
export interface Order {
  id: string;
  courseId: string;
  course: Course;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface OrderDetail {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export interface OrderItem {
  orderDetailId: number;
  itemType: string;
  itemId: number;
  title: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface LegacyOrderDetail extends Order {
  orderItems: LegacyOrderItem[];
  billingAddress?: BillingAddress;
  paymentHistory: PaymentHistory[];
}

export interface LegacyOrderItem {
  id: string;
  courseId: string;
  courseName: string;
  price: number;
  quantity: number;
}

export interface BillingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

export interface OrderStatus {
  orderId: number;
  status: string;
  totalAmount: number;
  lastPayment?: any;
}

export interface CheckoutRequest {
  paymentMethod: "credit_card" | "paypal" | "bank_transfer";
  billingAddress?: BillingAddress;
}

export interface CheckoutResponse {
  orderId?: string;
  paymentUrl?: string;
  expiresAt?: string;
  status?: string;
  checkoutUrl: string;
  provider: string;
}

// Payment Method Types
export interface PaymentMethod {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

// Order Summary Types for Orders List
export interface OrderSummary {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  lines: number;
}

// Quiz Types
export interface QuizSummary {
  id: number;
  courseId: number;
  title: string;
  totalQuestions: number;
  createdAt: string;
}

export interface QuizForTake {
  quizId: number;
  title: string;
  totalQuestions: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
  type: string;
  order: number;
}

export interface QuizOption {
  id: number;
  text: string;
  isCorrect?: boolean;
}

export interface QuizAttempt {
  attemptId: number;
  quizId: number;
  studentId: number;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  totalQuestions: number;
  correctAnswers?: number;
  status: string;
}

export interface QuizAnswer {
  questionId: number;
  selectedOptionIds: number[];
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

export interface QuizAttemptResult {
  attemptId: number;
  quizId: number;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  submittedAt: string;
  answers: QuizAnswerResult[];
}

export interface QuizAnswerResult {
  questionId: number;
  questionText: string;
  selectedOptionIds: number[];
  correctOptionIds: number[];
  isCorrect: boolean;
}
