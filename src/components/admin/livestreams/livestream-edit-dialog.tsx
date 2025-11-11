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
import { Livestream, updateLivestream } from '@/services/livestreamService'
import { getAccountsByRole } from '@/services/userService'
import { useEffect, useState } from 'react'

interface LivestreamEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  livestream: Livestream | null
}

export function LivestreamEditDialog({
  open,
  onOpenChange,
  onSuccess,
  livestream,
}: LivestreamEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  const [formData, setFormData] = useState({
    teacherId: '',
    title: '',
    schedule: '',
    price: '',
  })

  const [teachers, setTeachers] = useState<
    Array<{ id: number; fullName: string | null }>
  >([])

  // Load livestream data into form when dialog opens
  useEffect(() => {
    if (open && livestream) {
      // Convert schedule to datetime-local format (YYYY-MM-DDThh:mm)
      const scheduleDate = new Date(livestream.schedule)
      const localDateTime = new Date(
        scheduleDate.getTime() - scheduleDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, 16)

      setFormData({
        teacherId: livestream.teacherId.toString(),
        title: livestream.title,
        schedule: localDateTime,
        price: livestream.price.toString(),
      })

      fetchOptions()
    }
  }, [open, livestream])

  const fetchOptions = async () => {
    try {
      setIsLoadingOptions(true)
      // Fetch teachers
      const teachersData = await getAccountsByRole('Teacher')
      setTeachers(teachersData.filter((t) => t.fullName !== null))
    } catch (err) {
      console.error('Error fetching options:', err)
      setError('Failed to load teachers')
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!livestream) {
      setError('No livestream selected')
      setIsSubmitting(false)
      return
    }

    try {
      // Validate
      if (
        !formData.teacherId ||
        !formData.title ||
        !formData.schedule ||
        !formData.price
      ) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      // Convert to proper types (matching API request format)
      const data = {
        teacherId: parseInt(formData.teacherId),
        title: formData.title,
        schedule: new Date(formData.schedule).toISOString(),
        price: parseInt(formData.price),
      }

      // Update livestream
      await updateLivestream(livestream.id, data)

      // Close dialog and refresh
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update livestream')
      console.error('Error updating livestream:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  if (!livestream) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Livestream</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Update livestream information. Note: Course ID cannot be changed.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Course ID (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="courseId">Course ID (Read-only)</Label>
              <Input
                id="courseId"
                type="text"
                value={`Course ${livestream.courseId}`}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Course cannot be changed after creation
              </p>
            </div>

            {/* Teacher Selection */}
            <div className="grid gap-2">
              <Label htmlFor="teacherId">
                Teacher <span className="text-destructive">*</span>
              </Label>
              {isLoadingOptions ? (
                <div className="text-sm text-muted-foreground">
                  Loading teachers...
                </div>
              ) : (
                <select
                  id="teacherId"
                  value={formData.teacherId}
                  onChange={(e) => handleChange('teacherId', e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id.toString()}>
                      {teacher.fullName} (ID: {teacher.id})
                    </option>
                  ))}
                </select>
              )}
            </div>

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
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Livestream'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
