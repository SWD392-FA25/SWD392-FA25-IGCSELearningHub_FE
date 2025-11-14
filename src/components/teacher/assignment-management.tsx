'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeacherAssignmentCreateDialog } from '@/components/teacher/assignment-create-dialog'
import { AssignmentEditDialog } from '@/components/admin/assignments/assignment-edit-dialog'
import { AssignmentSubmissionDialog } from '@/components/admin/assignments/assignment-submission-dialog'
import {
  Assignment,
  deleteAssignment,
  getAssignments,
} from '@/services/assignmentService'
import {
  Calendar,
  Eye,
  FileText,
  Pencil,
  Trash2,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface TeacherAssignmentManagementProps {
  courseId: number
}

export function TeacherAssignmentManagement({
  courseId,
}: TeacherAssignmentManagementProps) {
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAssignments()
  }, [courseId])

  const fetchAssignments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Fetch all assignments and filter by courseId
      const response = await getAssignments(1, 100)
      const courseAssignments = response.data.filter(
        (a) => a.courseId === courseId
      )
      setAssignments(courseAssignments)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch assignments')
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
      } catch (err) {
        const error = err as Error
        alert(error.message || 'Failed to delete assignment')
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
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Assignments</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage assignments and track submissions
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
          Create Assignment
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
              <CardTitle>Course Assignments</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {assignments.length} Total
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4">Loading assignments...</p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 opacity-20" />
              <p className="mt-4">
                No assignments found. Create your first assignment!
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
                  {assignments.map((assignment) => (
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

      <TeacherAssignmentCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchAssignments}
        courseId={courseId}
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
    </>
  )
}
