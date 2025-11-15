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
import { createPackage } from '@/services/packageService'
import { useEffect, useState } from 'react'

interface PackageCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function PackageCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: PackageCreateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    courseIds: [] as number[],
  })

  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>(
    []
  )

  // Fetch courses when dialog opens
  useEffect(() => {
    if (open) {
      fetchCourses()
    }
  }, [open])

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true)
      const coursesData = await getCourses(1, 100) // Get first 100 courses
      setCourses(coursesData.data)
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError('Failed to load courses')
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate
      if (
        !formData.name ||
        !formData.price ||
        formData.courseIds.length === 0
      ) {
        setError(
          'Please fill in all required fields and select at least one course'
        )
        setIsSubmitting(false)
        return
      }

      // Convert to proper types
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        courseIds: formData.courseIds,
      }

      // Create package
      await createPackage(data)

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        courseIds: [],
      })

      // Close dialog and refresh
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to create package')
      console.error('Error creating package:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleCourseToggle = (courseId: number) => {
    setFormData((prev) => {
      const isSelected = prev.courseIds.includes(courseId)
      return {
        ...prev,
        courseIds: isSelected
          ? prev.courseIds.filter((id) => id !== courseId)
          : [...prev.courseIds, courseId],
      }
    })
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Package</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Add a new course package. Fill in all the required information.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Package Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Package Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter package name (e.g., Gói tham khảo)"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                maxLength={200}
                required
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Enter package description (optional)"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Optional description for the package
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
                placeholder="Enter price (e.g., 1000000)"
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

            {/* Course Selection */}
            <div className="grid gap-2">
              <Label>
                Select Courses <span className="text-destructive">*</span>
              </Label>
              {isLoadingCourses ? (
                <div className="text-sm text-muted-foreground">
                  Loading courses...
                </div>
              ) : (
                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                  {courses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No courses available
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {courses.map((course) => (
                        <label
                          key={course.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-muted p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={formData.courseIds.includes(course.id)}
                            onChange={() => handleCourseToggle(course.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <span className="text-sm">
                            {course.title} (ID: {course.id})
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Selected: {formData.courseIds.length} course(s)
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
              {isSubmitting ? 'Creating...' : 'Create Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
