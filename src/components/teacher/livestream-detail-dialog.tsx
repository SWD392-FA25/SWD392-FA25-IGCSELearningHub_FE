'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Livestream } from '@/services/livestreamService'
import { getCourseById } from '@/services/courseService'
import { Calendar, DollarSign, Users, Video, BookOpen } from 'lucide-react'

interface LivestreamDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  livestream: Livestream | null
}

export function LivestreamDetailDialog({
  open,
  onOpenChange,
  livestream,
}: LivestreamDetailDialogProps) {
  const [courseName, setCourseName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchCourseName = async () => {
      if (!livestream) return
      
      try {
        setIsLoading(true)
        const course = await getCourseById(livestream.courseId)
        setCourseName(course.title)
      } catch (error) {
        console.error('Failed to fetch course:', error)
        setCourseName(`Course ${livestream.courseId}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (livestream?.courseId) {
      fetchCourseName()
    }
  }, [livestream])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  if (!livestream) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Video className="h-6 w-6 text-primary" />
            Livestream Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Section */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Title
            </h3>
            <p className="text-2xl font-bold text-foreground">
              {livestream.title}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Course */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Course
              </div>
              <p className="text-lg font-semibold text-foreground">
                {isLoading ? 'Loading...' : courseName}
              </p>
            </div>

            {/* Schedule */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Schedule
              </div>
              <p className="text-sm font-medium text-foreground">
                {formatDate(livestream.schedule)}
              </p>
            </div>

            {/* Price */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Price
              </div>
              <p className="text-xl font-bold text-green-600">
                {formatPrice(livestream.price)}
              </p>
            </div>

            {/* Registrations */}
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Registrations
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold text-primary">
                  {livestream.registrationCount}
                </p>
                <span className="text-sm text-muted-foreground">students</span>
              </div>
            </div>
          </div>

          {/* ID Badge */}
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-4">
            <span className="text-sm font-medium text-muted-foreground">
              Livestream ID:
            </span>
            <Badge variant="outline" className="font-mono">
              #{livestream.id}
            </Badge>
          </div>

          {/* Status Indicator */}
          <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              <p className="text-sm font-medium text-foreground">
                {new Date(livestream.schedule) > new Date()
                  ? 'Upcoming Session'
                  : 'Past Session'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
