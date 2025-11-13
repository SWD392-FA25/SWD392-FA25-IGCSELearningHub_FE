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
import { getUserById } from '@/services/userService'
import { Calendar, DollarSign, Users, BookOpen, GraduationCap } from 'lucide-react'

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
  const [teacherName, setTeacherName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDetails = async () => {
      if (!livestream) return
      
      try {
        setIsLoading(true)
        
        // Fetch course and teacher details in parallel
        const [course, teacher] = await Promise.all([
          getCourseById(livestream.courseId).catch(() => null),
          getUserById(livestream.teacherId).catch(() => null)
        ])
        
        setCourseName(course?.title || `Course ${livestream.courseId}`)
        setTeacherName(teacher?.fullName || teacher?.userName || `Teacher ${livestream.teacherId}`)
      } catch (error) {
        console.error('Failed to fetch details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (livestream) {
      fetchDetails()
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[100]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Livestream Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Title Section */}
          <div className="rounded-lg border bg-gradient-to-br from-primary/5 via-background to-background p-6">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="outline" className="font-mono">
                ID: {livestream.id}
              </Badge>
              {new Date(livestream.schedule) > new Date() ? (
                <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary"></div>
                  Upcoming
                </span>
              ) : (
                <Badge variant="secondary">Completed</Badge>
              )}
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {livestream.title}
            </h3>
          </div>

          {/* Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Course */}
            <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Course</p>
                  <p className="text-sm font-semibold text-foreground break-words">
                    {isLoading ? 'Loading...' : courseName}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher */}
            <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Teacher</p>
                  <p className="text-sm font-semibold text-foreground break-words">
                    {isLoading ? 'Loading...' : teacherName}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Schedule</p>
                  <p className="text-sm font-semibold text-foreground break-words">
                    {formatDate(livestream.schedule)}
                  </p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Price</p>
                  <p className="text-base font-bold text-green-600 dark:text-green-400 break-words">
                    {formatPrice(livestream.price)}
                  </p>
                </div>
              </div>
            </div>

            {/* Registrations */}
            <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Student Registrations</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-primary">
                      {livestream.registrationCount}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {livestream.registrationCount === 1 ? 'student' : 'students'} enrolled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className={`rounded-lg border-l-4 p-4 ${
            new Date(livestream.schedule) > new Date()
              ? 'border-primary bg-primary/5'
              : 'border-muted bg-muted/30'
          }`}>
            <div className="flex items-center gap-2">
              {new Date(livestream.schedule) > new Date() ? (
                <>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                  <p className="text-sm font-medium text-foreground">
                    This livestream session is scheduled for the future
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  This livestream session has already taken place
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
