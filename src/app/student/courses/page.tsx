"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { enrollmentService } from "@/services/enrollment-service"
import { Enrollment } from "@/types/api-types"
import { useAuth } from "@/hooks/useAuth"

export default function StudentCoursesPage() {
  const { user, isAuthenticated } = useAuth()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      loadEnrollments()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      const response = await enrollmentService.getMyEnrollments()
      if (response.succeeded && response.data) {
        setEnrollments(response.data)
      } else {
        setError(response.message || "Failed to load enrollments")
      }
    } catch (err) {
      setError("Failed to load your learning progress. Please try again later.")
      console.error("Error loading enrollments:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'not-started':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please login to view your courses.</p>
            <Link 
              href="/login"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Login
            </Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">My Courses</h1>
          
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your courses...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!loading && !error && enrollments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven&apos;t enrolled in any courses yet.</p>
              <Link 
                href="/courses"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Browse Courses
              </Link>
            </div>
          )}

          {!loading && !error && enrollments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-card border border-border rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {enrollment.course?.title || 'Course'}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(enrollment.status)}`}>
                        {enrollment.status}
                      </span>
                      <Link 
                        href={`/courses/${enrollment.courseId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Course →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
