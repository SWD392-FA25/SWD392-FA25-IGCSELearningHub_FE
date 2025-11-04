'use client'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAssignment } from '@/services/assignmentService'
import { getCourses } from '@/services/courseService'
import { useEffect, useState } from 'react'

interface AssignmentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AssignmentCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: AssignmentCreateDialogProps) {
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
  })
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>(
    []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses for dropdown
  useEffect(() => {
    if (open) {
      fetchCourses()
    }
  }, [open])

  const fetchCourses = async () => {
    try {
      const response = await getCourses(1, 100)
      setCourses(response.data.map((c) => ({ id: c.id, title: c.title })))
    } catch (err) {
      console.error('Failed to fetch courses:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const courseIdValue = parseInt(formData.courseId)
      if (isNaN(courseIdValue) || courseIdValue <= 0) {
        throw new Error('Please select a valid course')
      }

      await createAssignment({
        courseId: courseIdValue,
        title: formData.title,
        description: formData.description,
      })

      // Reset form
      setFormData({
        courseId: '',
        title: '',
        description: '',
      })

      onSuccess() // Refresh the assignment list
      onOpenChange(false) // Close dialog
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create assignment'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange =
    (field: keyof typeof formData) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      // Reset form when closing
      setFormData({
        courseId: '',
        title: '',
        description: '',
      })
      setError(null)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="courseId">Course *</Label>
            <select
              id="courseId"
              value={formData.courseId}
              onChange={handleChange('courseId')}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Assignment Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="e.g., Algebra & Equations"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="e.g., Linear and Quadratic Equations"
              required
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
