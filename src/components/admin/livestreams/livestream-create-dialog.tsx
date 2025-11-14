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
import { getCourses } from '@/services/courseService'
import { createLivestream } from '@/services/livestreamService'
import { getAccountsByRole } from '@/services/userService'
import { useEffect, useState } from 'react'

interface LivestreamCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function LivestreamCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: LivestreamCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingOptions, setIsLoadingOptions] = useState(false)

  const [formData, setFormData] = useState({
    courseId: '',
    teacherId: '',
    title: '',
    schedule: '',
    price: '',
  })

  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>(
    []
  )
  const [teachers, setTeachers] = useState<
    Array<{ id: number; fullName: string | null }>
  >([])

  // Fetch courses and teachers when dialog opens
  useEffect(() => {
    if (open) {
      fetchOptions()
    }
  }, [open])

  const fetchOptions = async () => {
    try {
      setIsLoadingOptions(true)
      // Fetch courses and teachers in parallel
      const [coursesData, teachersData] = await Promise.all([
        getCourses(1, 100), // Get first 100 courses
        getAccountsByRole('Teacher'),
      ])

      setCourses(coursesData.data)
      setTeachers(teachersData.filter((t) => t.fullName !== null))
    } catch (err) {
      console.error('Error fetching options:', err)
      setError('Failed to load courses and teachers')
    } finally {
      setIsLoadingOptions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate
      if (
        !formData.courseId ||
        !formData.teacherId ||
        !formData.title ||
        !formData.schedule ||
        !formData.price
      ) {
        setError('Please fill in all fields')
        setIsSubmitting(false)
        return
      }

      // Convert to proper types
      const data = {
        courseId: parseInt(formData.courseId),
        teacherId: parseInt(formData.teacherId),
        title: formData.title,
        schedule: new Date(formData.schedule).toISOString(),
        price: parseInt(formData.price),
      }

      // Create livestream
      await createLivestream(data)

      // Reset form
      setFormData({
        courseId: '',
        teacherId: '',
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
            Add a new livestream session. Fill in all the required information.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Course Selection */}
            <div className="grid gap-2">
              <Label htmlFor="courseId">
                Course <span className="text-destructive">*</span>
              </Label>
              {isLoadingOptions ? (
                <div className="text-sm text-muted-foreground">
                  Loading courses...
                </div>
              ) : (
                <select
                  id="courseId"
                  value={formData.courseId}
                  onChange={(e) => handleChange('courseId', e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.title} (ID: {course.id})
                    </option>
                  ))}
                </select>
              )}
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
              {isSubmitting ? 'Creating...' : 'Create Livestream'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
