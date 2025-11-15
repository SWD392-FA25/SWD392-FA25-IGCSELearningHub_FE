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
import { Package, updatePackage } from '@/services/packageService'
import { useEffect, useState } from 'react'

interface PackageEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  package: Package | null
}

export function PackageEditDialog({
  open,
  onOpenChange,
  onSuccess,
  package: pkg,
}: PackageEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    courseIds: [] as number[],
    replaceAllCourses: false,
  })

  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>(
    []
  )

  // Load package data into form when dialog opens
  useEffect(() => {
    if (open && pkg) {
      setFormData({
        name: pkg.name,
        description: '', // Description not in Package type, will be empty
        price: pkg.price.toString(),
        courseIds: [], // Will need to fetch package details to get course IDs
        replaceAllCourses: false,
      })

      fetchCourses()
    }
  }, [open, pkg])

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

    if (!pkg) {
      setError('No package selected')
      setIsSubmitting(false)
      return
    }

    try {
      // Validate
      if (!formData.name || !formData.price) {
        setError('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      // Convert to proper types
      const data = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        courseIds: formData.courseIds,
        replaceAllCourses: formData.replaceAllCourses,
      }

      // Update package
      await updatePackage(pkg.id, data)

      // Close dialog and refresh
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to update package')
      console.error('Error updating package:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
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

  if (!pkg) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Update package information and courses.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Package ID (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="packageId">Package ID (Read-only)</Label>
              <Input
                id="packageId"
                type="text"
                value={`Package ${pkg.id}`}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Package Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Package Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter package name"
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
            </div>

            {/* Price */}
            <div className="grid gap-2">
              <Label htmlFor="price">
                Price (VND) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
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

            {/* Replace All Courses Checkbox */}
            <div className="grid gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.replaceAllCourses}
                  onChange={(e) =>
                    handleChange('replaceAllCourses', e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">
                  Replace all existing courses with selected ones
                </span>
              </label>
              <p className="text-xs text-muted-foreground ml-6">
                If unchecked, selected courses will be added to existing ones
              </p>
            </div>

            {/* Course Selection */}
            <div className="grid gap-2">
              <Label>Select Courses to Add/Replace</Label>
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
                {formData.replaceAllCourses
                  ? `Will replace with ${formData.courseIds.length} course(s)`
                  : `Will add ${formData.courseIds.length} course(s)`}
              </p>
            </div>

            {/* Current Package Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-medium text-blue-900">
                Current Package Info:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• Name: {pkg.name}</li>
                <li>• Current courses: {pkg.courseCount}</li>
                <li>
                  • Price:{' '}
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(pkg.price)}
                </li>
              </ul>
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
              {isSubmitting ? 'Updating...' : 'Update Package'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
