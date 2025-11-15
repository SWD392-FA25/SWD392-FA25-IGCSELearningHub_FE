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
import { useState } from 'react'

interface TeacherAssignmentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  courseId: number
}

export function TeacherAssignmentCreateDialog({
  open,
  onOpenChange,
  onSuccess,
  courseId,
}: TeacherAssignmentCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createAssignment({
        courseId,
        title: formData.title,
        description: formData.description,
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
      })

      onSuccess()
      onOpenChange(false)
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      setFormData({
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
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6"
            >
              {isLoading ? 'Creating...' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
