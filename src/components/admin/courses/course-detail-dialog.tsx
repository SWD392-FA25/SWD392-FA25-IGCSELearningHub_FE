"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, DollarSign, Calendar, FileText, Video, ClipboardCheck, GraduationCap, Award } from "lucide-react"
import { Course } from "@/services/courseService"

interface CourseDetailDialogProps {
  course: Course
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseDetailDialog({ course, open, onOpenChange }: CourseDetailDialogProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Course Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Course ID: {course.id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="font-medium">
                  {course.level}
                </Badge>
                <Badge variant="secondary" className="font-medium">
                  {course.subjectGroup}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {course.description || "No description available"}
            </p>
          </div>

          {/* Info */}
          {course.info && (
            <div className="rounded-lg border border-border p-4 bg-blue-50 dark:bg-blue-950/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Award className="h-4 w-4" />
                Course Information
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                {course.info}
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(course.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Enrollments</p>
                  <p className="text-lg font-bold">{course.totalEnrollments || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <ClipboardCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quizzes</p>
                  <p className="text-lg font-bold">{course.totalQuizzes || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Assignments</p>
                  <p className="text-lg font-bold">{course.totalAssignments || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Video className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Livestreams</p>
                  <p className="text-lg font-bold">{course.totalLivestreams || 0}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-900/20">
                  <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm font-semibold">{formatDate(course.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Course Summary
            </h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Content Items:</span>
                <span className="font-semibold">
                  {(course.totalQuizzes || 0) + (course.totalAssignments || 0) + (course.totalLivestreams || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Level:</span>
                <span className="font-semibold">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subject Group:</span>
                <span className="font-semibold">{course.subjectGroup}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
