"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/Button"
import { courseService } from "@/services/course-service"
import { orderService } from "@/services/order-service"
import { paymentMethodService } from "@/services/payment-method-service"
import { CourseDetail, CheckoutResponse, CheckoutRequest, Unit, CourseLesson, PaymentMethod } from "@/types/api-types"
import { useAuth } from "@/hooks/useAuth"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEnrolling, setIsEnrolling] = useState(false)
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false)

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

  const loadPaymentMethods = async () => {
    setLoadingPaymentMethods(true)
    try {
      const response = await paymentMethodService.getActivePaymentMethods()
      if (response.succeeded && response.data) {
        setPaymentMethods(response.data)
      } else {
        // Fallback payment methods if API fails
        setPaymentMethods([
          { id: 1, name: 'VNPay', description: 'VNPay payment gateway', isActive: true },
          { id: 2, name: 'Cash', description: 'Thanh toán tiền mặt', isActive: true }
        ])
      }
    } catch (err) {
      console.error('Error loading payment methods:', err)
      // Fallback payment methods
      setPaymentMethods([
        { id: 1, name: 'VNPay', description: 'VNPay payment gateway', isActive: true },
        { id: 2, name: 'Cash', description: 'Thanh toán tiền mặt', isActive: true }
      ])
    } finally {
      setLoadingPaymentMethods(false)
    }
  }

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (!course) return

    // Load payment methods and show selection modal
    await loadPaymentMethods()
    setShowPaymentModal(true)
  }

  const handlePaymentMethodSelect = async (paymentMethod: PaymentMethod) => {
    setShowPaymentModal(false)
    
    if (!course) return
    
    try {
      setIsEnrolling(true)

      let orderDetail: any = null
      try {
        const createResp = await orderService.createOrderWithItems([
          {
            itemType: "Course",
            itemId: course.id,
            quantity: 1
          }
        ])
        if (createResp.succeeded && createResp.data) {
          orderDetail = createResp.data
        }
      } catch (err) {
        console.error('Failed to create order:', err)
      }

      if (!orderDetail) {
        orderDetail = {
          orderId: Date.now(),
          orderDate: new Date().toISOString(),
          totalAmount: course.price || 0,
          status: 'Pending',
          items: [{
            orderDetailId: Date.now(),
            itemType: 'Course',
            itemId: course.id,
            title: course.title,
            unitPrice: course.price || 0,
            quantity: 1,
            lineTotal: course.price || 0
          }]
        }
      }

      // Handle different payment methods
      if (paymentMethod.name.toLowerCase() === 'cash') {
        // For cash payment, navigate directly to orders page
        router.push('/orders')
        return
      }

      // For VNPay or other online payment methods, initialize checkout
      let checkout: CheckoutResponse | null = null
      try {
        const paymentMethodType = paymentMethod.name.toLowerCase() === 'vnpay' ? 'credit_card' : 'bank_transfer'
        const checkoutResp = await orderService.checkout(String(orderDetail.orderId), { paymentMethod: paymentMethodType } as CheckoutRequest)
        if (checkoutResp.succeeded && checkoutResp.data) checkout = checkoutResp.data
      } catch {
        // ignore and fallback
      }

      if (!checkout) {
        checkout = { 
          orderId: String(orderDetail.orderId), 
          checkoutUrl: `/mock-payment?orderId=${String(orderDetail.orderId)}`, 
          paymentUrl: `/mock-payment?orderId=${String(orderDetail.orderId)}`, 
          provider: 'mock', 
          expiresAt: '', 
          status: 'pending' 
        }
      }

      const paymentUrl = checkout?.checkoutUrl || checkout?.paymentUrl || `/mock-payment?orderId=${String(orderDetail.orderId)}`
      window.location.href = String(paymentUrl)

    } catch (err) {
      console.error('Enrollment error:', err)
      alert('Failed to start enrollment process. Please try again later.')
    } finally {
      setIsEnrolling(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
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
            <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Course Header */}
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
                  <p className="text-xl text-muted-foreground mb-6">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Level:</span>
                      <span>{course.level || 'All Levels'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Subject Group:</span>
                      <span>{course.subjectGroup || 'General'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Price:</span>
                      <span>{formatPrice(course.price)}</span>
                    </div>
                  </div>
                </div>



                {/* Course Content */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Course Content</h2>
                  
                  {course.units && course.units.length > 0 ? (
                    <div className="space-y-4">
                      {course.units.map((unit: Unit, unitIndex: number) => (
                        <div key={unit.id} className="border border-border rounded-lg">
                          <div className="p-4 bg-muted/20">
                            <h3 className="font-semibold text-lg">
                              Unit {unitIndex + 1}: {unit.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {unit.lessons.length} lessons
                            </p>
                          </div>
                          
                          <div className="divide-y divide-border">
                            {unit.lessons.map((lesson: CourseLesson, lessonIndex: number) => (
                              <div key={lesson.id} className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-muted-foreground">
                                    {lessonIndex + 1}.
                                  </span>
                                  <span className="font-medium">{lesson.title}</span>
                                  {lesson.isFreePreview && (
                                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Duration: N/A
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Course content will be available after enrollment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="p-6 bg-card border border-border rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-4">{formatPrice(course.price)}</div>
                  
                  <Button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full mb-4"
                    variant="primary"
                    size="lg"
                  >
                    {isEnrolling ? 'Processing...' : 'Enroll Now'}
                  </Button>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Units:</span>
                      <span className="font-medium">{course.units?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Lessons:</span>
                      <span className="font-medium">
                        {course.units?.reduce((acc, unit) => acc + unit.lessons.length, 0) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Free Previews:</span>
                      <span className="font-medium">
                        {course.units?.reduce((acc, unit) => 
                          acc + unit.lessons.filter(lesson => lesson.isFreePreview).length, 0) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Quizzes:</span>
                      <span className="font-medium">{course.totalQuizzes || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-medium">{course.level || 'All Levels'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-50-important">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
            
            {loadingPaymentMethods ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading payment methods...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method)}
                    disabled={isEnrolling}
                    className="w-full p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={isEnrolling}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}