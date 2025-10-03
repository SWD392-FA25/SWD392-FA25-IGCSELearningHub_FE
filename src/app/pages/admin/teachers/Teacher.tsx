"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"
import { TeacherEditDialog } from "@/components/admin/teachers/teacher-edit-dialog"

interface Teacher {
  id: string
  name: string
  email: string
  status: "Online" | "Offline"
  courses: string[]
  classes: Array<{ name: string; time: string; subject: string }>
}

export default function TeachersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "T001",
      name: "Dr. Smith",
      email: "dr.smith@igcse.edu",
      status: "Online",
      courses: ["Mathematics IGCSE"],
      classes: [
        { name: "Class A", time: "Mon 10:00 AM", subject: "Mathematics" },
        { name: "Class B", time: "Wed 2:00 PM", subject: "Mathematics" },
      ],
    },
    {
      id: "T002",
      name: "Ms. Johnson",
      email: "ms.johnson@igcse.edu",
      status: "Offline",
      courses: ["English Literature"],
      classes: [{ name: "Class C", time: "Tue 9:00 AM", subject: "English" }],
    },
    {
      id: "T003",
      name: "Prof. Williams",
      email: "prof.williams@igcse.edu",
      status: "Online",
      courses: ["Physics Advanced"],
      classes: [
        { name: "Class D", time: "Thu 11:00 AM", subject: "Physics" },
        { name: "Class E", time: "Fri 1:00 PM", subject: "Physics" },
      ],
    },
  ])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter((t) => t.id !== id))
    }
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setEditOpen(true)
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
                <h1 className="text-3xl font-bold">Teacher Management</h1>
                <p className="mt-1 text-muted-foreground">Manage teacher accounts and assignments</p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Teacher ID</th>
                        <th className="pb-3 font-medium text-muted-foreground">Teacher Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Email</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium">{teacher.id}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/.jpg?height=40&width=40&query=${teacher.name}`}
                                />
                                <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{teacher.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{teacher.email}</td>
                          <td className="py-4">
                            <Badge
                              variant="secondary"
                              className={
                                teacher.status === "Online"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                              }
                            >
                              <span
                                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${teacher.status === "Online" ? "bg-green-600" : "bg-gray-600"}`}
                              />
                              {teacher.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(teacher)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(teacher.id)}
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

      {editingTeacher && <TeacherEditDialog teacher={editingTeacher} open={editOpen} onOpenChange={setEditOpen} />}
    </div>
  )
}
