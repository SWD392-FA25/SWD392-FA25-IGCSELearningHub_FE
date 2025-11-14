"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Users, Clock, BookOpen } from "lucide-react"

interface Class {
  id: string
  name: string
  course: string
  teacher: string
  students: string[]
  schedule: string
}

interface ClassDetailDialogProps {
  classItem: Class
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClassDetailDialog({ classItem, open, onOpenChange }: ClassDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Class Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{classItem.name}</h3>
              <p className="text-sm text-muted-foreground">Class ID: {classItem.id}</p>
              <p className="mt-1 text-sm text-muted-foreground">{classItem.course}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teacher</p>
                  <p className="font-semibold">{classItem.teacher}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schedule</p>
                  <p className="font-semibold">{classItem.schedule}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Students ({classItem.students.length})</h4>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {classItem.students.map((student, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg bg-muted p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/.jpg?height=40&width=40&query=${student}`} />
                    <AvatarFallback>{student.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{student}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">Class Information</h4>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>• Room: Building A, Room 201</p>
              <p>• Duration: 90 minutes per session</p>
              <p>• Capacity: 30 students</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
