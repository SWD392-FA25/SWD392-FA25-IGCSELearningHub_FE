'use client'

import { TeacherHeader } from '@/components/layout/teacher-header'
import { TeacherFooter } from '@/components/layout/teacher-footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCourseById, Course } from '@/services/courseService'
import { getEnrollmentsByAccount } from '@/services/enrollmentService'
import { getStoredUser } from '@/services/authService'
import {
  BookOpen,
  Calendar,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

function TeacherCoursesPageContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 12

  // Fetch courses from API
  useEffect(() => {
    fetchEnrolledCourses()
  }, [currentPage])

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.level.toLowerCase().includes(query) ||
          course.id.toString().includes(query)
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery, courses])

  const fetchEnrolledCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Get current user
      const user = getStoredUser()
      if (!user || !user.id) {
        setError('User not found. Please login again.')
        return
      }

      // Get enrollments for this teacher
      const enrollmentResponse = await getEnrollmentsByAccount(user.id, currentPage, pageSize)
      
      // Fetch course details for each enrollment
      const coursePromises = enrollmentResponse.data.map(enrollment => 
        getCourseById(enrollment.courseId)
      )
      
      const coursesData = await Promise.all(coursePromises)
      
      setCourses(coursesData)
      setFilteredCourses(coursesData)
      setTotalPages(enrollmentResponse.totalPages)
      setTotalCount(enrollmentResponse.totalCount)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch enrolled courses')
      console.error('Error fetching enrolled courses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCourseClick = (courseId: number) => {
    router.push(`/teacher/courses/${courseId}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader />

      <main className="flex-1 bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your enrolled courses, assignments, quizzes, and livestreams
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses by title, level, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 opacity-20" />
                <p className="mt-4">
                  {searchQuery
                    ? 'No courses found matching your search.'
                    : 'No courses found. You are not enrolled in any courses yet.'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.id}
                      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <CardHeader className="border-b bg-gradient-to-br from-primary/5 to-primary/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                              {course.title}
                            </CardTitle>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-4 w-4" />
                          <span className="font-medium">{course.level}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-primary">
                            ${course.price.toLocaleString()}
                          </span>
                        </div>

                        <Button
                          className="w-full mt-3"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCourseClick(course.id)
                          }}
                        >
                          Manage Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between rounded-lg border bg-card p-4">
                    <div className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                      <span className="font-medium text-foreground">{totalCount}</span> courses
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {(() => {
                          const maxVisible = 5
                          let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                          let endPage = Math.min(totalPages, startPage + maxVisible - 1)
                          
                          if (endPage - startPage + 1 < maxVisible) {
                            startPage = Math.max(1, endPage - maxVisible + 1)
                          }
                          
                          return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="h-9 min-w-[2.5rem]"
                            >
                              {page}
                            </Button>
                          ))
                        })()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      </main>

      <TeacherFooter />
    </div>
  )
}

export default TeacherCoursesPageContent
