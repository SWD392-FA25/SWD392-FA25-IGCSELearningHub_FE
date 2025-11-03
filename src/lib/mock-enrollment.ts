import { EnrollmentDetail, Lesson, Quiz, Assignment, Course } from '@/types/api-types'

const STORAGE_KEY = 'mock_enrollments'

function readAll(): EnrollmentDetail[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as EnrollmentDetail[]
  } catch {
    return []
  }
}

function writeAll(items: EnrollmentDetail[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    
  }
}

export function createMockEnrollment(courseId: string, courseTitle?: string, price?: number): EnrollmentDetail {
  const id = `mock-enroll-${Date.now()}`
  const lessons: Lesson[] = Array.from({ length: 12 }).map((_, i) => ({
    id: `lesson-${i + 1}`,
    title: `Week ${Math.ceil((i + 1) / 2)} - Slot ${i + 1}`,
    content: `Content for lesson ${i + 1}`,
    duration: 90,
    isCompleted: i < 6, 
  }))
  const quizzes: Quiz[] = Array.from({ length: 6 }).map((_, i) => ({
    id: `quiz-${i + 1}`,
    title: `Quiz ${i + 1} - Week ${Math.ceil((i + 1) / 2)}`,
    description: '',
    totalQuestions: 10,
    duration: 15,
    attempts: 1,
    bestScore: i < 4 ? Math.round(70 + Math.random() * 30) : undefined,
    isCompleted: i < 4,
  }))
  const assignments: Assignment[] = Array.from({ length: 4 }).map((_, i) => ({
    id: `assignment-${i + 1}`,
    title: `Assignment ${i + 1} - Week ${ (i+1) * 2 }`,
    description: '',
    dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 3600 * 1000).toISOString(),
    submittedAt: i < 3 ? new Date(Date.now() - (i + 1) * 3 * 24 * 3600 * 1000).toISOString() : undefined,
    grade: i < 3 ? Math.round(85 + Math.random() * 10) : undefined,
    feedback: i < 3 ? 'Good work' : undefined,
    status: i < 3 ? 'submitted' : 'pending'
  }))

  const enrollment: EnrollmentDetail = {
    id,
    courseId,
    course: {
      id: courseId,
      title: courseTitle || 'Course',
      description: '',
      instructor: 'Instructor',
      price: price || 0,
      duration: '12 weeks',
      level: 'IGCSE',
      thumbnail: undefined,
      category: 'General',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Course,
    enrolledAt: new Date().toISOString(),
    progress: Math.round((lessons.filter(l => l.isCompleted).length / lessons.length) * 100),
    status: 'active',
    lessons,
    quizzes,
    assignments,
  }

  const all = readAll()
  all.push(enrollment)
  writeAll(all)
  return enrollment
}

export function getMockEnrollments(): EnrollmentDetail[] {
  return readAll()
}

export function getMockEnrollmentById(id: string): EnrollmentDetail | undefined {
  return readAll().find(e => e.id === id || e.courseId === id || String(e.course?.id) === String(id))
}
