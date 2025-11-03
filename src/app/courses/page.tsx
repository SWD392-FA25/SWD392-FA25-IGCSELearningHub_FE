"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { courseService } from "@/services/course-service"
import { CourseSummary } from "@/types/api-types"

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const response = await courseService.getAllCourses()
      if (response.succeeded && response.data) {
        setCourses(response.data)
      } else {
        setError(response.message || "Failed to load courses")
      }
    } catch (err) {
      setError("Failed to load courses. Please try again later.")
      console.error("Error loading courses:", err)
    } finally {
      setLoading(false)
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
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={loadCourses}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Try Again
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
        {/* Header Section */}
        <section className="w-full py-16 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Courses</h1>
            <p className="text-lg text-muted-foreground">
              Choose from our comprehensive selection of IGCSE courses taught by expert instructors
            </p>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No courses available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer bg-card"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{course.shortDescription}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium text-foreground">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quizzes</span>
                        <span className="font-medium text-foreground">{course.totalQuizzes}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Assignments</span>
                        <span className="font-medium text-foreground">{course.totalAssignments}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium text-primary">{formatPrice(course.price)}</span>
                      </div>
                    </div>

                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                      View Details
                    </button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
