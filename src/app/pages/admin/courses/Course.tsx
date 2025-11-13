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
          <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-full">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Manage all courses and their details
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90 w-fit"
                onClick={() => setCreateOpen(true)}
              >
                {/* <Plus className="h-4 w-4" /> */}
                Add Course
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            <Card className="shadow-sm">
              <CardHeader className="bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    All Courses
                    <Badge variant="secondary" className="ml-2">
                      {filteredCourses.length}
                    </Badge>
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <div className="animate-pulse">Loading courses...</div>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="py-12 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 text-muted-foreground">
                      {searchQuery
                        ? 'No courses found matching your search.'
                        : 'No courses found. Create your first course!'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/30 text-left">
                          <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">
                            ID
                          </th>
                          <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">
                            Course Title
                          </th>
                          <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">
                            Level
                          </th>
                          <th className="px-4 py-3 font-semibold text-sm text-muted-foreground">
                            Price
                          </th>
                          <th className="px-4 py-3 font-semibold text-sm text-muted-foreground max-w-xs">
                            Description
                          </th>
                          <th className="px-4 py-3 font-semibold text-sm text-muted-foreground text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCourses.map((course) => (
                          <tr
                            key={course.id}
                            className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-4 text-sm font-medium">
                              {course.id}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-start gap-3">
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">
                                    {course.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {course.totalQuizzes} quizzes • {course.totalAssignments} assignments
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className="font-medium">{course.level}</span>
                            </td>
                            <td className="px-4 py-4 text-sm font-semibold text-green-600">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(course.price)}
                            </td>
                            <td className="px-4 py-4 text-sm max-w-xs">
                              <div
                                className="line-clamp-2 text-muted-foreground"
                                title={course.shortDescription}
                              >
                                {course.shortDescription}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleViewDetail(course)}
                                  title="View details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-blue-500/10 hover:text-blue-500"
                                  onClick={() => handleEdit(course)}
                                  title="Edit course"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-destructive/10 text-destructive"
                                  onClick={() => handleDelete(course.id)}
                                  title="Delete course"
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
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-semibold text-foreground">{totalCount}</span> courses
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="font-medium"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="min-w-[2.5rem] font-medium"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="font-medium"
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
          course={selectedCourse}
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
