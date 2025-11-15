"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, GraduationCap, TrendingUp } from "lucide-react"

interface Course {
  id: string
  name: string
  students: number
  teacher: string
  status: "Active" | "Disabled"
  progress: number
}

interface CourseDetailDialogProps {
  course: Course
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseDetailDialog({ course, open, onOpenChange }: CourseDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Course Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{course.name}</h3>
              <p className="text-sm text-muted-foreground">Course ID: {course.id}</p>
            </div>
            <Badge
              variant="secondary"
              className={
                course.status === "Active"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-red-100 text-red-700 hover:bg-red-100"
              }
            >
              {course.status}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students Enrolled</p>
                  <p className="text-2xl font-bold">{course.students}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teacher</p>
                  <p className="text-lg font-semibold">{course.teacher}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Course Progress</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall completion</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary transition-all" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold">Additional Information</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Course duration: 12 weeks</p>
              <p>• Classes per week: 3</p>
              <p>• Next class: Monday, 10:00 AM</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
