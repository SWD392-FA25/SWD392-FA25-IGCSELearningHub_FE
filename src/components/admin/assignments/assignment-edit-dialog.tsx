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
import { Assignment, updateAssignment } from '@/services/assignmentService'
import { useEffect, useState } from 'react'

interface AssignmentEditDialogProps {
  assignment: Assignment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AssignmentEditDialog({
  assignment,
  open,
  onOpenChange,
  onSuccess,
}: AssignmentEditDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update form when assignment changes
  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title,
        description: assignment.description || '',
      })
    }
  }, [assignment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignment) return

    setIsLoading(true)
    setError(null)

    try {
      await updateAssignment(assignment.id, {
        title: formData.title,
        description: formData.description,
      })

      onSuccess() // Refresh the assignment list
      onOpenChange(false) // Close dialog
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update assignment'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setError(null)
    }
    onOpenChange(open)
  }

  if (!assignment) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Course</Label>
            <div className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
              Course ID: {assignment.courseId}
            </div>
            <p className="text-xs text-muted-foreground">
              Course cannot be changed when editing
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">Assignment Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="e.g., Algebra & Equations"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <textarea
              id="edit-description"
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
              {isLoading ? 'Updating...' : 'Update Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
