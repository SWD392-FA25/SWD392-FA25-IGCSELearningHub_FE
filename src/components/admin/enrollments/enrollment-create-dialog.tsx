'use client'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { getCourses } from '@/services/courseService'
import { createEnrollment } from '@/services/enrollmentService'
import { getAllAccounts } from '@/services/userService'
import { User } from '@/types/api'
import { useEffect, useState } from 'react'

interface EnrollmentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EnrollmentCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: EnrollmentCreateDialogProps) {
  const [formData, setFormData] = useState({
    accountId: '',
    courseId: '',
    status: '1', // Default to Active
  })
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>(
    []
  )
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses and users for dropdowns
  useEffect(() => {
    if (open) {
      fetchCourses()
      fetchUsers()
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

  const fetchUsers = async () => {
    try {
      const response = await getAllAccounts()
      setUsers(response)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const accountIdValue = parseInt(formData.accountId)
      const courseIdValue = parseInt(formData.courseId)
      const statusValue = parseInt(formData.status)

      if (isNaN(accountIdValue) || accountIdValue <= 0) {
        throw new Error('Please select a valid user')
      }
      if (isNaN(courseIdValue) || courseIdValue <= 0) {
        throw new Error('Please select a valid course')
      }

      await createEnrollment({
        accountId: accountIdValue,
        courseId: courseIdValue,
        status: statusValue,
      })

      // Reset form
      setFormData({
        accountId: '',
        courseId: '',
        status: '1',
      })

      onSuccess() // Refresh the enrollment list
      onOpenChange(false) // Close dialog
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create enrollment'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      // Reset form when closing
      setFormData({
        accountId: '',
        courseId: '',
        status: '1',
      })
      setError(null)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Enrollment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="accountId">Student/User *</Label>
            <select
              id="accountId"
              value={formData.accountId}
              onChange={handleChange('accountId')}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.userName} (ID: {user.id})
                </option>
              ))}
            </select>
          </div>

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
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange('status')}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Active enrollments allow students to access the course
            </p>
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
              {isLoading ? 'Creating...' : 'Create Enrollment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
