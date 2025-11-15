"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, GraduationCap } from "lucide-react"

interface Teacher {
  id: string
  name: string
  email: string
  status: "Online" | "Offline"
  courses: string[]
  classes: Array<{ name: string; time: string; subject: string }>
}

interface TeacherEditDialogProps {
  teacher: Teacher
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TeacherEditDialog({ teacher, open, onOpenChange }: TeacherEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Teacher Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Teacher Profile */}
          <div className="flex items-start gap-4 rounded-lg border border-border p-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`/.jpg?height=80&width=80&query=${teacher.name}`} />
              <AvatarFallback className="text-2xl">{teacher.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{teacher.name}</h3>
              <p className="text-sm text-muted-foreground">Teacher ID: {teacher.id}</p>
              <Badge
                variant="secondary"
                className={`mt-2 ${teacher.status === "Online" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
              >
                <span
                  className={`mr-1.5 inline-block h-2 w-2 rounded-full ${teacher.status === "Online" ? "bg-green-600" : "bg-gray-600"}`}
                />
                {teacher.status}
              </Badge>
            </div>
          </div>

          {/* Basic Information Form */}
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Full Name</Label>
                <Input id="teacherName" defaultValue={teacher.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherEmail">Email</Label>
                <Input id="teacherEmail" type="email" defaultValue={teacher.email} />
              </div>
            </div>

            {/* Teaching Courses */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Teaching Courses</h4>
              </div>
              <div className="space-y-2">
                {teacher.courses.map((course, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">{course}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Schedule */}
            <div className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Class Schedule</h4>
              </div>
              <div className="space-y-3">
                {teacher.classes.map((classItem, index) => (
                  <div key={index} className="rounded-lg bg-muted p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{classItem.name}</p>
                          <p className="text-sm text-muted-foreground">{classItem.subject}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{classItem.time}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
