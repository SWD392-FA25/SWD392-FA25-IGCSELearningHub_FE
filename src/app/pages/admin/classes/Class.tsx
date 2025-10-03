"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Pencil, Trash2, Plus, GraduationCap } from "lucide-react"
import { ClassDetailDialog } from "@/components/admin/classes/class-detail-dialog"

interface Class {
  id: string
  name: string
  course: string
  teacher: string
  students: string[]
  schedule: string
}

export default function ClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [classes, setClasses] = useState<Class[]>([
    {
      id: "CL001",
      name: "Mathematics A",
      course: "Mathematics IGCSE",
      teacher: "Dr. Smith",
      students: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"],
      schedule: "Mon, Wed 10:00 AM",
    },
    {
      id: "CL002",
      name: "English Literature C",
      course: "English Literature",
      teacher: "Ms. Johnson",
      students: ["Jane Smith", "Emily Brown"],
      schedule: "Tue, Thu 9:00 AM",
    },
    {
      id: "CL003",
      name: "Physics D",
      course: "Physics Advanced",
      teacher: "Prof. Williams",
      students: ["John Doe", "Sarah Williams", "Tom Davis"],
      schedule: "Thu, Fri 11:00 AM",
    },
  ])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter((c) => c.id !== id))
    }
  }

  const handleViewDetail = (classItem: Class) => {
    setSelectedClass(classItem)
    setDetailOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Class Management</h1>
                <p className="mt-1 text-muted-foreground">Manage classes, schedules, and student assignments</p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Class ID</th>
                        <th className="pb-3 font-medium text-muted-foreground">Class Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Teacher</th>
                        <th className="pb-3 font-medium text-muted-foreground">Students</th>
                        <th className="pb-3 font-medium text-muted-foreground">Schedule</th>
                        <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classes.map((classItem) => (
                        <tr key={classItem.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium">{classItem.id}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <GraduationCap className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{classItem.name}</p>
                                <p className="text-sm text-muted-foreground">{classItem.course}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm">{classItem.teacher}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {classItem.students.slice(0, 3).map((student, i) => (
                                  <Avatar key={i} className="h-7 w-7 border-2 border-card">
                                    <AvatarImage
                                      src={`/.jpg?height=28&width=28&query=${student}`}
                                    />
                                    <AvatarFallback>{student.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              {classItem.students.length > 3 && (
                                <span className="text-sm text-muted-foreground">+{classItem.students.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-sm">{classItem.schedule}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewDetail(classItem)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(classItem.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {selectedClass && <ClassDetailDialog classItem={selectedClass} open={detailOpen} onOpenChange={setDetailOpen} />}
    </div>
  )
}
