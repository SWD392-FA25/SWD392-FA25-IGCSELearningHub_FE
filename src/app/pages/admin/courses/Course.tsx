'use client'

import { CourseCreateDialog } from '@/components/admin/courses/course-create-dialog'
import { CourseDetailDialog } from '@/components/admin/courses/course-detail-dialog'
import { CourseEditDialog } from '@/components/admin/courses/course-edit-dialog'
import { CourseUpdateDialog } from '@/components/admin/courses/course-update-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import { Course, deleteCourse, getCourses } from '@/services/courseService'
import { BookOpen, Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

function CoursesPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch courses from API
  useEffect(() => {
    fetchCourses()
  }, [currentPage]) // Refetch when page changes

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
          course.shortDescription.toLowerCase().includes(query) ||
          course.id.toString().includes(query)
      )
      setFilteredCourses(filtered)
    }
  }, [searchQuery, courses])

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getCourses(currentPage, pageSize)
      setCourses(response.data)
      setFilteredCourses(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch courses')
      console.error('Error fetching courses:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(id)
        fetchCourses()
      } catch (err: any) {
        alert(err.message || 'Failed to delete course')
      }
    }
  }

  const handleViewDetail = (course: Course) => {
    setSelectedCourse(course)
    setDetailOpen(true)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setUpdateOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Course Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage all courses and their details
                </p>
              </div>
              <Button
                className="bg-primary"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading courses...
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchQuery
                      ? 'No courses found matching your search.'
                      : 'No courses found.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-3 font-medium text-muted-foreground">
                            ID
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Course Title
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Level
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Description
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Students
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Teacher
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Progress
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course) => (
                          <tr
                            key={course.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-4 text-sm font-medium">
                              {course.id}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                  <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {course.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {course.totalQuizzes} quizzes •{' '}
                                    {course.totalAssignments} assignments
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-sm">
                              <Badge variant="outline">{course.level}</Badge>
                            </td>
                            <td className="py-4 text-sm font-medium">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(course.price)}
                            </td>
                            <td
                              className="py-4 text-sm max-w-xs truncate"
                              title={course.shortDescription}
                            >
                              {course.shortDescription}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {course.students || 'N/A'}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {course.teacher || 'N/A'}
                            </td>
                            <td className="py-4">
                              <Badge
                                variant="secondary"
                                className={
                                  course.status === 'Active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                }
                              >
                                <span
                                  className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                                    course.status === 'Active'
                                      ? 'bg-green-600'
                                      : 'bg-gray-600'
                                  }`}
                                />
                                {course.status || 'Active'}
                              </Badge>
                            </td>
                            <td className="py-4">
                              {course.progress !== undefined ? (
                                <div className="flex items-center gap-3">
                                  <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                                    <div
                                      className="h-full bg-primary transition-all"
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">
                                    {course.progress}%
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewDetail(course)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(course)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDelete(course.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && filteredCourses.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
                  courses
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedCourse && (
        <CourseDetailDialog
          course={{
            id: selectedCourse.id.toString(),
            name: selectedCourse.title,
            students: selectedCourse.students || 0,
            teacher: selectedCourse.teacher || 'N/A',
            status: selectedCourse.status || 'Active',
            progress: selectedCourse.progress || 0,
          }}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      )}

      {editingCourse && (
        <>
          <CourseEditDialog
            course={{
              id: editingCourse.id.toString(),
              name: editingCourse.title,
              students: editingCourse.students || 0,
              teacher: editingCourse.teacher || 'N/A',
              status: editingCourse.status || 'Active',
              progress: editingCourse.progress || 0,
            }}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <CourseUpdateDialog
            course={editingCourse}
            open={updateOpen}
            onOpenChange={setUpdateOpen}
            onSuccess={fetchCourses}
          />
        </>
      )}

      <CourseCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchCourses}
      />
    </div>
  )
}

// Wrap with SearchProvider
export default function CoursesPage() {
  return (
    <SearchProvider>
      <CoursesPageContent />
    </SearchProvider>
  )
}
