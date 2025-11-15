'use client'

import { AssignmentCreateDialog } from '@/components/admin/assignments/assignment-create-dialog'
import { AssignmentEditDialog } from '@/components/admin/assignments/assignment-edit-dialog'
import { AssignmentSubmissionDialog } from '@/components/admin/assignments/assignment-submission-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import {
  Assignment,
  deleteAssignment,
  getAssignments,
} from '@/services/assignmentService'
import { getCourseById, Course } from '@/services/courseService'
import {
  BookOpen,
  Calendar,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

function AssignmentsPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [submissionOpen, setSubmissionOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  )
  const [viewingAssignment, setViewingAssignment] = useState<{
    id: number
    title: string
  } | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseMap, setCourseMap] = useState<Map<number, string>>(new Map())

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch assignments from API
  useEffect(() => {
    fetchAssignments()
  }, [currentPage]) // Refetch when page changes

  // Filter assignments based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAssignments(assignments)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = assignments.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(query) ||
          assignment.id.toString().includes(query) ||
          assignment.courseId.toString().includes(query)
      )
      setFilteredAssignments(filtered)
    }
  }, [searchQuery, assignments])

  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getAssignments(currentPage, pageSize)
      setAssignments(response.data)
      setFilteredAssignments(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)

      // Fetch course titles for all unique courseIds
      const uniqueCourseIds = [...new Set(response.data.map(a => a.courseId))]
      const newCourseMap = new Map<number, string>()
      
      console.log('Fetching courses for IDs:', uniqueCourseIds)
      
      await Promise.all(
        uniqueCourseIds.map(async (courseId) => {
          try {
            const course = await getCourseById(courseId)
            console.log(`Course ${courseId}:`, course)
            newCourseMap.set(courseId, course.title)
          } catch (error) {
            console.error(`Failed to fetch course ${courseId}:`, error)
            newCourseMap.set(courseId, `Course ${courseId}`)
          }
        })
      )
      
      console.log('Course map:', newCourseMap)
      setCourseMap(newCourseMap)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assignments')
      console.error('Error fetching assignments:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id)
        fetchAssignments()
      } catch (err: any) {
        alert(err.message || 'Failed to delete assignment')
      }
    }
  }

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment)
    setEditOpen(true)
  }

  const handleViewSubmissions = (assignment: Assignment) => {
    setViewingAssignment({
      id: assignment.id,
      title: assignment.title,
    })
    setSubmissionOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
          <div className="container mx-auto max-w-full px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Assignment Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage all assignments and track submissions
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                {/* <Plus className="mr-2 h-4 w-4" /> */}
                Add Assignment
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>All Assignments</CardTitle>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {filteredAssignments.length} Total
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4">Loading assignments...</p>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-4">
                      {searchQuery
                        ? 'No assignments found matching your search.'
                        : 'No assignments found. Create your first assignment!'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30 text-left">
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            ID
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Assignment Title
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Course Name
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Created Date
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Submissions
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((assignment) => (
                          <tr
                            key={assignment.id}
                            className="border-b transition-colors hover:bg-muted/50 last:border-0"
                          >
                            <td className="px-6 py-4 text-sm font-medium">
                              {assignment.id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-foreground">
                                  {assignment.title}
                                </span>
                                {assignment.description && (
                                  <span className="mt-1 text-xs text-muted-foreground line-clamp-1">
                                    {assignment.description}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {courseMap.get(assignment.courseId) || `Course ${assignment.courseId}`}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(assignment.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {assignment.submissionCount}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600"
                                  onClick={() => handleViewSubmissions(assignment)}
                                  title="View submissions"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEdit(assignment)}
                                  title="Edit assignment"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDelete(assignment.id)}
                                  title="Delete assignment"
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
            {!isLoading && filteredAssignments.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount}</span> assignments
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

      <AssignmentCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchAssignments}
      />

      <AssignmentEditDialog
        assignment={editingAssignment}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={fetchAssignments}
      />

      <AssignmentSubmissionDialog
        assignmentId={viewingAssignment?.id || null}
        assignmentTitle={viewingAssignment?.title || ''}
        open={submissionOpen}
        onOpenChange={setSubmissionOpen}
      />
    </div>
  )
}

// Wrap with SearchProvider
export default function AssignmentsPage() {
  return (
    <SearchProvider>
      <AssignmentsPageContent />
    </SearchProvider>
  )
}
