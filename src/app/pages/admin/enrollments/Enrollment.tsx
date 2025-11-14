'use client'

import { EnrollmentCreateDialog } from '@/components/admin/enrollments/enrollment-create-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import {
  Enrollment,
  deleteEnrollment,
  getEnrollments,
  getStatusLabel,
} from '@/services/enrollmentService'
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Plus,
  Trash2,
  User,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

function EnrollmentsPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch enrollments from API
  useEffect(() => {
    fetchEnrollments()
  }, [currentPage]) // Refetch when page changes

  // Filter enrollments based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEnrollments(enrollments)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = enrollments.filter(
        (enrollment) =>
          enrollment.accountUserName.toLowerCase().includes(query) ||
          enrollment.courseTitle.toLowerCase().includes(query) ||
          enrollment.enrollmentId.toString().includes(query) ||
          enrollment.accountId.toString().includes(query) ||
          enrollment.courseId.toString().includes(query)
      )
      setFilteredEnrollments(filtered)
    }
  }, [searchQuery, enrollments])

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getEnrollments(currentPage, pageSize)
      setEnrollments(response.data)
      setFilteredEnrollments(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch enrollments')
      console.error('Error fetching enrollments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (enrollmentId: number) => {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await deleteEnrollment(enrollmentId)
        fetchEnrollments()
      } catch (err: any) {
        alert(err.message || 'Failed to delete enrollment')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Group enrollments by course
  const enrollmentsByCourse = filteredEnrollments.reduce((acc, enrollment) => {
    if (!acc[enrollment.courseId]) {
      acc[enrollment.courseId] = {
        courseTitle: enrollment.courseTitle,
        courseId: enrollment.courseId,
        enrollments: [],
      }
    }
    acc[enrollment.courseId].enrollments.push(enrollment)
    return acc
  }, {} as Record<number, { courseTitle: string; courseId: number; enrollments: Enrollment[] }>)

  const courseGroups = Object.values(enrollmentsByCourse)

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto max-w-full px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Enrollment Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage student enrollments and course registrations
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                {/* <Plus className="mr-2 h-4 w-4" /> */}
                Add Enrollment
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {/* Summary Cards */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Enrollments
                      </p>
                      <h3 className="text-2xl font-bold">
                        {filteredEnrollments.length}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Active Enrollments
                      </p>
                      <h3 className="text-2xl font-bold">
                        {
                          filteredEnrollments.filter(
                            (e) => e.status === 'Active'
                          ).length
                        }
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Courses
                      </p>
                      <h3 className="text-2xl font-bold">
                        {courseGroups.length}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enrollments grouped by course */}
            {isLoading ? (
              <Card className="shadow-sm">
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4">Loading enrollments...</p>
                  </div>
                </CardContent>
              </Card>
            ) : filteredEnrollments.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-4">
                      {searchQuery
                        ? 'No enrollments found matching your search.'
                        : 'No enrollments found. Create your first enrollment!'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {courseGroups.map((group) => (
                  <Card key={group.courseId} className="shadow-sm">
                    <CardHeader className="border-b bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle>{group.courseTitle}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {group.enrollments.length} student
                              {group.enrollments.length !== 1 ? 's' : ''}{' '}
                              enrolled
                            </p>
                          </div>
                        </div>
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          Course ID: {group.courseId}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/30 text-left">
                              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                                Enrollment ID
                              </th>
                              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                                Student
                              </th>
                              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                                Enrollment Date
                              </th>
                              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                                Status
                              </th>
                              <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.enrollments.map((enrollment) => (
                              <tr
                                key={enrollment.enrollmentId}
                                className="border-b transition-colors hover:bg-muted/50 last:border-0"
                              >
                                <td className="px-6 py-4 text-sm font-medium">
                                  {enrollment.enrollmentId}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">
                                      {enrollment.accountUserName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      ID: {enrollment.accountId}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(enrollment.enrollmentDate)}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`h-2 w-2 rounded-full ${
                                        enrollment.status === 'Active'
                                          ? 'bg-green-600'
                                          : 'bg-gray-600'
                                      }`}
                                    />
                                    <span className="text-sm font-medium">
                                      {getStatusLabel(enrollment.status)}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() =>
                                      handleDelete(enrollment.enrollmentId)
                                    }
                                    title="Delete enrollment"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filteredEnrollments.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount}</span> enrollments
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="h-9"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const maxVisible = 5
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                      const endPage = Math.min(totalPages, startPage + maxVisible - 1)
                      
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-9"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <EnrollmentCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchEnrollments}
      />
    </div>
  )
}

// Wrap with SearchProvider
export default function EnrollmentsPage() {
  return (
    <SearchProvider>
      <EnrollmentsPageContent />
    </SearchProvider>
  )
}
