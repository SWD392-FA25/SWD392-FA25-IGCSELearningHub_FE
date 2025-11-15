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
import { createCourse } from '@/services/courseService'
import { useState } from 'react'

interface CourseCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CourseCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: CourseCreateDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: '',
    price: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate price is a number
      const priceValue = parseFloat(formData.price)
      if (isNaN(priceValue) || priceValue < 0) {
        throw new Error('Price must be a valid positive number')
      }

      await createCourse({
        title: formData.title,
        description: formData.description,
        level: formData.level,
        price: priceValue,
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        level: '',
        price: '',
      })

      onSuccess() // Refresh the course list
      onOpenChange(false) // Close dialog
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course')
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
      // Reset form when closing
      setFormData({
        title: '',
        description: '',
        level: '',
        price: '',
      })
      setError(null)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange('title')}
              placeholder="e.g., Drama"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="e.g., Diễn xuất, kịch bản, phân tích nhân vật"
              required
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level *</Label>
            <Input
              id="level"
              value={formData.level}
              onChange={handleChange('level')}
              placeholder="e.g., Coursework-based"
              required
            />
            <p className="text-xs text-muted-foreground">
              Examples: Core, Extended, Coursework-based
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (VND) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleChange('price')}
              placeholder="e.g., 1500000"
              min="0"
              step="1000"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter price in Vietnamese Dong (VND)
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
              {isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
