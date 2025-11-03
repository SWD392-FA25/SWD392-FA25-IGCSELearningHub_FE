"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { enrollmentService } from "@/services/enrollment-service"
import { EnrollmentDetail, Lesson, Quiz, Assignment, Enrollment } from "@/types/api-types"
import { getMockEnrollmentById } from '@/lib/mock-enrollment'
import { useAuth } from "@/hooks/useAuth"

export default function StudentCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [enrollment, setEnrollment] = useState<EnrollmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<'slots' | 'quizzes' | 'assignments'>('slots')

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    if (params.id) loadEnrollment(params.id as string)
  }, [params.id, isAuthenticated])

  const loadEnrollment = async (courseId: string) => {
    try {
      setLoading(true)
  let found: Enrollment | EnrollmentDetail | null = null

        // Try API first
      try {
        const resp = await enrollmentService.getMyEnrollments()
        if (resp.succeeded && resp.data) {
          found = resp.data.find(e => String(e.courseId) === String(courseId) || (e.course && String(e.course.id) === String(courseId))) || null
        }
      } catch {
        // ignore, fallback to mock below
      }

      // If not found via API, check local mock enrollments
      if (!found) {
        const mock = getMockEnrollmentById(courseId)
        if (mock) found = mock
      }

      if (!found) {
        setError('Enrollment not found for this course')
        return
      }

      // We have an enrollment summary; try to fetch enrollment detail by id via API
      try {
        const detailResp = await enrollmentService.getEnrollmentById(found.id)
        if (detailResp.succeeded && detailResp.data) {
          setEnrollment(detailResp.data)
          return
        }
      } catch {
        // ignore and fallback to using `found` as detail
      }

      // If detail API not available or returned nothing, try to get from mock
      const mockDetail = getMockEnrollmentById(found.id) || getMockEnrollmentById(courseId)
      if (mockDetail) {
        setEnrollment(mockDetail)
        return
      }

      // Otherwise set minimal data based on found
      setEnrollment({
        ...found,
        lessons: (found && 'lessons' in found && found.lessons) ? found.lessons : [],
        quizzes: (found && 'quizzes' in found && found.quizzes) ? found.quizzes : [],
        assignments: (found && 'assignments' in found && found.assignments) ? found.assignments : []
      } as EnrollmentDetail)
    } catch (err) {
      console.error('Error loading enrollment detail', err)
      setError('Failed to load course information')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please login to view this course.</p>
            <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Login</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-background">
        <section className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/student/courses" className="text-sm text-primary hover:underline">← Back to Courses</Link>

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading course...</p>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-12 text-destructive">{error}</div>
            )}

            {!loading && !error && enrollment && (
              <>
                <h1 className="text-4xl font-bold text-foreground mt-6">{enrollment.course?.title || 'Course'}</h1>
                <p className="text-muted-foreground mt-2">Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-6 bg-card border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <div className="text-3xl font-bold text-primary">{enrollment.progress || 0}%</div>
                    <div className="w-full bg-muted rounded-full h-2 mt-4">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${enrollment.progress || 0}%` }} />
                    </div>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Completed Slots</p>
                    <div className="text-3xl font-bold text-primary">{(enrollment.lessons || []).filter(l => l.isCompleted).length}/{(enrollment.lessons || []).length || 0}</div>
                  </div>

                  <div className="p-6 bg-card border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground">Quiz Average</p>
                    <div className="text-3xl font-bold text-primary">{calculateQuizAverage(enrollment.quizzes || [])}%</div>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="flex gap-8 px-4 border-b border-border pb-4">
                    <button
                      onClick={() => setActiveTab('slots')}
                      className={`px-4 pb-2 transition-colors ${
                        activeTab === 'slots' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      Learning Slots
                    </button>

                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className={`px-4 pb-2 transition-colors ${
                        activeTab === 'quizzes' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      Quizzes
                    </button>

                    <button
                      onClick={() => setActiveTab('assignments')}
                      className={`px-4 pb-2 transition-colors ${
                        activeTab === 'assignments' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-primary'
                      }`}
                    >
                      Assignments
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {activeTab === 'slots' && renderLessons(enrollment.lessons || [])}
                    {activeTab === 'quizzes' && renderQuizzes(enrollment.quizzes || [])}
                    {activeTab === 'assignments' && renderAssignments(enrollment.assignments || [])}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )

  function calculateQuizAverage(quizzes: Quiz[]) {
    if (!quizzes || quizzes.length === 0) return 0
    const completed = quizzes.filter(q => typeof q.bestScore === 'number')
    if (completed.length === 0) return 0
    const sum = completed.reduce((s, q) => s + (q.bestScore || 0), 0)
    return Math.round(sum / completed.length)
  }

  function renderLessons(lessons: Lesson[]) {
    if (!lessons || lessons.length === 0) return (
      <div className="text-muted-foreground">No learning slots available yet.</div>
    )

    return lessons.map((lesson) => (
      <div key={lesson.id} className="bg-muted/50 rounded-lg p-6 border border-border flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{lesson.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">Duration: {lesson.duration} mins</p>
          <p className="text-sm text-muted-foreground mt-1">{lesson.isCompleted ? 'Completed' : 'Upcoming'}</p>
        </div>
        <div>
          {lesson.isCompleted ? (
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Replay</button>
          ) : (
            <button onClick={() => router.push(`/student/courses/${params.id}/play/${lesson.id}`)} className="px-4 py-2 border border-primary text-primary rounded-lg">Join</button>
          )}
        </div>
      </div>
    ))
  }

  function renderQuizzes(quizzes: Quiz[]) {
    if (!quizzes || quizzes.length === 0) return (
      <div className="text-muted-foreground">No quizzes yet.</div>
    )

    return quizzes.map((q) => (
      <div key={q.id} className="bg-muted/50 rounded-lg p-6 border border-border flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{q.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">Score: {q.bestScore ?? '—'}</p>
        </div>
        <div>
          <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg">Review</button>
        </div>
      </div>
    ))
  }

  function renderAssignments(assignments: Assignment[]) {
    if (!assignments || assignments.length === 0) return (
      <div className="text-muted-foreground">No assignments yet.</div>
    )

    return assignments.map((a) => (
      <div key={a.id} className="bg-muted/50 rounded-lg p-6 border border-border flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">{a.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{a.status === 'submitted' ? `Submitted - Score: ${a.grade ?? '—'}` : `Due: ${a.dueDate}`}</p>
        </div>
        <div>
          <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg">View Feedback</button>
        </div>
      </div>
    ))
  }
}
