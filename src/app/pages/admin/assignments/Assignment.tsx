'use client'

import { AssignmentCreateDialog } from '@/components/admin/assignments/assignment-create-dialog'
import { AssignmentEditDialog } from '@/components/admin/assignments/assignment-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import {
  Assignment,
  deleteAssignment,
  getAssignments,
} from '@/services/assignmentService'
import {
  BookOpen,
  Calendar,
  FileText,
  Pencil,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

function AssignmentsPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  )
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch assignments from API
  useEffect(() => {
    fetchAssignments()
  }, [])

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
      const response = await getAssignments(1, 100) // Get all assignments
      setAssignments(response.data)
      setFilteredAssignments(response.data)
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
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Assignment Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage all assignments and track submissions
                </p>
              </div>
              <Button
                className="bg-primary"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Assignment
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>
                  All Assignments ({filteredAssignments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading assignments...
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchQuery
                      ? 'No assignments found matching your search.'
                      : 'No assignments found.'}
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
                            Assignment Title
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Course ID
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Created Date
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Submissions
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAssignments.map((assignment) => (
                          <tr
                            key={assignment.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-4 text-sm font-medium">
                              {assignment.id}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {assignment.title}
                                  </span>
                                  {assignment.description && (
                                    <span className="text-xs text-muted-foreground">
                                      {assignment.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-sm">
                              <Badge variant="outline" className="gap-1">
                                <BookOpen className="h-3 w-3" />
                                Course {assignment.courseId}
                              </Badge>
                            </td>
                            <td className="py-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(assignment.createdAt)}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className={
                                    assignment.submissionCount > 0
                                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                  }
                                >
                                  <Users className="mr-1 h-3 w-3" />
                                  {assignment.submissionCount} submissions
                                </Badge>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(assignment)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDelete(assignment.id)}
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
