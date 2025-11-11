'use client'

import { EnrollmentCreateDialog } from '@/components/admin/enrollments/enrollment-create-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import {
  Enrollment,
  deleteEnrollment,
  getEnrollments,
  getStatusColor,
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Enrollment Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage student enrollments and course registrations
                </p>
              </div>
              <Button
                className="bg-primary"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
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
              <Card>
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

              <Card>
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

              <Card>
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
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    Loading enrollments...
                  </div>
                </CardContent>
              </Card>
            ) : filteredEnrollments.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-muted-foreground">
                    {searchQuery
                      ? 'No enrollments found matching your search.'
                      : 'No enrollments found.'}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {courseGroups.map((group) => (
                  <Card key={group.courseId}>
                    <CardHeader>
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
                        <Badge variant="outline">
                          Course ID: {group.courseId}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border text-left">
                              <th className="pb-3 font-medium text-muted-foreground">
                                Enrollment ID
                              </th>
                              <th className="pb-3 font-medium text-muted-foreground">
                                Student
                              </th>
                              <th className="pb-3 font-medium text-muted-foreground">
                                Enrollment Date
                              </th>
                              <th className="pb-3 font-medium text-muted-foreground">
                                Status
                              </th>
                              <th className="pb-3 font-medium text-muted-foreground">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.enrollments.map((enrollment) => (
                              <tr
                                key={enrollment.enrollmentId}
                                className="border-b border-border last:border-0"
                              >
                                <td className="py-4 text-sm font-medium">
                                  #{enrollment.enrollmentId}
                                </td>
                                <td className="py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                                      <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {enrollment.accountUserName}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        ID: {enrollment.accountId}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(enrollment.enrollmentDate)}
                                  </div>
                                </td>
                                <td className="py-4">
                                  <Badge
                                    variant="secondary"
                                    className={`${getStatusColor(
                                      enrollment.status
                                    )} hover:${getStatusColor(
                                      enrollment.status
                                    )}`}
                                  >
                                    <span
                                      className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                                        enrollment.status === 'Active'
                                          ? 'bg-green-600'
                                          : 'bg-gray-600'
                                      }`}
                                    />
                                    {getStatusLabel(enrollment.status)}
                                  </Badge>
                                </td>
                                <td className="py-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={() =>
                                      handleDelete(enrollment.enrollmentId)
                                    }
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
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
                  enrollments
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
