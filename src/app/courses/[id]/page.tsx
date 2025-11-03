"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { courseService } from "@/services/course-service"
import { orderService } from "@/services/order-service"
import { enrollmentService } from "@/services/enrollment-service"
import { createMockEnrollment } from '@/lib/mock-enrollment'
import { CourseDetail, Order, CheckoutResponse } from "@/types/api-types"
import { useAuth } from "@/hooks/useAuth"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadCourse(params.id as string)
    }
  }, [params.id])

  const loadCourse = async (courseId: string) => {
    try {
      setLoading(true)
      const response = await courseService.getCourseById(courseId)
      if (response.succeeded && response.data) {
        setCourse(response.data)
      } else {
        setError(response.message || "Course not found")
      }
    } catch (err) {
      setError("Failed to load course details. Please try again later.")
      console.error("Error loading course:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!course) return

    try {
      setIsEnrolling(true)

      // 1) Try to create order for the course (backend). If API not available, fall back to a mock order.
      let order: Order | null = null
      try {
        const createResp = await orderService.createOrder(String(course.id))
        if (createResp.succeeded && createResp.data) {
          order = createResp.data
        }
      } catch {
        // ignore, will use mock
      }

      if (!order) {
        // backend not available; create a mock order object
        order = {
          id: `mock-order-${Date.now()}`,
          courseId: course.id,
          course: {
            id: course.id,
            title: course.title,
            description: course.description || '',
            instructor: '',
            price: course.price || 0,
            duration: course.level || '',
            level: course.level,
            thumbnail: undefined,
            category: '',
            isPublic: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          amount: course.price || 0,
          currency: 'VND',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as unknown as Order
      }

      // 2) Initialize checkout (payment) - ask backend to return a payment URL; else fall back to mock-payment
      let checkout: CheckoutResponse | null = null
      try {
        const checkoutResp = await orderService.checkout(String(order.id), { paymentMethod: 'credit_card' })
        if (checkoutResp.succeeded && checkoutResp.data) checkout = checkoutResp.data
      } catch {
        // ignore and fallback
      }

      if (!checkout) {
        checkout = { orderId: String(order.id), paymentUrl: `/mock-payment?orderId=${String(order.id)}`, expiresAt: '', status: 'pending' }
      }

      // Open payment page in a new window (use backend url if provided, otherwise open local mock)
  const paymentUrl = checkout.paymentUrl || `/mock-payment?orderId=${String(order.id)}`
  const paymentWindow = window.open(String(paymentUrl), '_blank')

      // 3) Poll order status until it's 'completed' or timeout
      const pollOrderStatus = (orderId: string, timeoutMs = 120000, intervalMs = 2000) => {
        return new Promise<string>((resolve, reject) => {
          const start = Date.now()
          const id = setInterval(async () => {
            try {
              const statusResp = await orderService.getOrderStatus(orderId)
              if (statusResp.succeeded && statusResp.data) {
                const status = statusResp.data.status?.toLowerCase()
                if (status === 'completed' || status === 'paid') {
                  clearInterval(id)
                  resolve('completed')
                } else if (status === 'failed' || status === 'cancelled') {
                  clearInterval(id)
                  reject(new Error('payment_failed'))
                }
              }
            } catch {
              // ignore transient errors
            }

            if (Date.now() - start > timeoutMs) {
              clearInterval(id)
              reject(new Error('timeout'))
            }
          }, intervalMs)
        })
      }

      // Also listen for a postMessage from the payment window (used by our mock payment page)
      const waitForMessage = new Promise<string>((resolve) => {
        const handler = (e: MessageEvent) => {
          // ensure origin is same (only trust our own mock page)
          if (e.origin !== window.location.origin) return
          if (e.data?.type === 'payment_success' && String(e.data.orderId) === String(order.id)) {
            window.removeEventListener('message', handler)
            resolve('completed')
          }
        }
        window.addEventListener('message', handler)
      })

      try {
  // Wait for either backend poll or window message (whichever signals completion first)
  await Promise.race([pollOrderStatus(String(order.id)), waitForMessage])

        // After payment completed (by message or poll), the backend should create an enrollment for the user.
        // Try to fetch my enrollments. If backend is not available or enrollment not yet created, create a local mock enrollment.
        try {
          const enrollResp = await enrollmentService.getMyEnrollments()
          if (enrollResp.succeeded && enrollResp.data) {
            const myEnrollment = enrollResp.data.find(e => String(e.courseId) === String(course.id) || (e.course && String(e.course.id) === String(course.id)))
            if (myEnrollment) {
              // Redirect to student course detail page
              router.push(`/student/courses/${course.id}`)
              return
            }
          }
        } catch {
          // ignore and fallback to mock
        }

        // Create a mock enrollment locally so the student can proceed even without backend data
        try {
          createMockEnrollment(String(course.id), course.title, course.price)
        } catch {
          // ignore
        }

        // Redirect to student course detail page (mock data will be used by student page)
        router.push(`/student/courses/${course.id}`)
      } catch (err) {
        console.error('Payment or enrollment error:', err)
        alert('Payment not completed. Please try again or contact support.')
      } finally {
        try {
          paymentWindow?.close()
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Error enrolling:', err)
      alert('Failed to enroll. Please try again.')
    } finally {
      setIsEnrolling(false)
    }
  }

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return 'Free'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "Course not found"}</p>
            <button 
              onClick={() => router.push('/courses')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Back to Courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="w-full py-16 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-lg font-semibold text-foreground">{course.level}</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">Quizzes</p>
                <p className="text-lg font-semibold text-foreground">{course.totalQuizzes}</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <p className="text-sm text-muted-foreground">Assignments</p>
                <p className="text-lg font-semibold text-foreground">{course.totalAssignments}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-primary">{formatPrice(course.price)}</div>
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isEnrolling ? 'Processing...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

