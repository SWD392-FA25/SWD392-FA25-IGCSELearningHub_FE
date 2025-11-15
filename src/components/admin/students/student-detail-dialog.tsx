"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, BookOpen, Calendar } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  status: "Online" | "Offline"
  courses: string[]
}

interface StudentDetailDialogProps {
  student: Student
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StudentDetailDialog({ student, open, onOpenChange }: StudentDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Student Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/.jpg?height=80&width=80&query=${student.name}`} />
              <AvatarFallback className="text-2xl">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">Student ID: {student.id}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {student.email}
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                student.status === "Online"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }
            >
              <span
                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${student.status === "Online" ? "bg-green-600" : "bg-gray-600"}`}
              />
              {student.status}
            </Badge>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Enrolled Courses</h4>
            </div>
            <div className="space-y-2">
              {student.courses.map((course, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span className="font-medium">{course}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Additional Information</h4>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Enrollment date: September 1, 2024</p>
              <p>• Total courses: {student.courses.length}</p>
              <p>• Average attendance: 95%</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
