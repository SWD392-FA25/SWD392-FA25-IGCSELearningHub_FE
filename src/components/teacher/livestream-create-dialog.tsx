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
import { createLivestream } from '@/services/livestreamService'
import { getStoredUser } from '@/services/authService'
import { useState } from 'react'

interface TeacherLivestreamCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  courseId: number
}

export function TeacherLivestreamCreateDialog({
  open,
  onOpenChange,
  onSuccess,
  courseId,
}: TeacherLivestreamCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    schedule: '',
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Get current teacher info
      const user = getStoredUser()
      if (!user || !user.id) {
        setError('User not found. Please login again.')
        return
      }

      // Validate
      if (!formData.title || !formData.schedule || !formData.price) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      // Convert to proper types
      const data = {
        courseId,
        teacherId: user.id,
        title: formData.title,
        schedule: new Date(formData.schedule).toISOString(),
        price: parseInt(formData.price),
      }

      // Create livestream
      await createLivestream(data)

      // Reset form
      setFormData({
        title: '',
        schedule: '',
        price: '',
      })

      // Close dialog and refresh
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create livestream')
      console.error('Error creating livestream:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Livestream</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new livestream session for this course.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter livestream title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                maxLength={200}
                required
              />
            </div>

            {/* Schedule */}
            <div className="grid gap-2">
              <Label htmlFor="schedule">
                Schedule <span className="text-destructive">*</span>
              </Label>
              <Input
                id="schedule"
                type="datetime-local"
                value={formData.schedule}
                onChange={(e) => handleChange('schedule', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Select date and time for the livestream
              </p>
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">
                Price (VND) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price (e.g., 150000)"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                min="0"
                step="1000"
                required
              />
              <p className="text-xs text-muted-foreground">
                Price in Vietnamese Dong (VND)
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6"
            >
              {isSubmitting ? 'Creating...' : 'Create Livestream'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
