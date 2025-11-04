"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Pencil, Trash2, Plus } from "lucide-react"
import { StudentDetailDialog } from "@/components/admin/students/student-detail-dialog"

interface Student {
  id: string
  name: string
  email: string
  status: "Online" | "Offline"
  courses: string[]
}

export default function StudentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const [students, setStudents] = useState<Student[]>([
    {
      id: "S001",
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Online",
      courses: ["Mathematics IGCSE", "Physics Advanced"],
    },
    {
      id: "S002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      status: "Offline",
      courses: ["English Literature", "Chemistry Core"],
    },
    {
      id: "S003",
      name: "Mike Johnson",
      email: "mike.j@example.com",
      status: "Online",
      courses: ["Mathematics IGCSE"],
    },
    {
      id: "S004",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      status: "Offline",
      courses: ["Physics Advanced", "Chemistry Core"],
    },
  ])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter((s) => s.id !== id))
    }
  }

  const handleViewDetail = (student: Student) => {
    setSelectedStudent(student)
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
                <h1 className="text-3xl font-bold">Student Management</h1>
                <p className="mt-1 text-muted-foreground">Manage student accounts and enrollments</p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">User ID</th>
                        <th className="pb-3 font-medium text-muted-foreground">User Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Email</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium">{student.id}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/.jpg?height=40&width=40&query=${student.name}`}
                                />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">{student.email}</td>
                          <td className="py-4">
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
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewDetail(student)}
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
                                onClick={() => handleDelete(student.id)}
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

      {selectedStudent && (
        <StudentDetailDialog student={selectedStudent} open={detailOpen} onOpenChange={setDetailOpen} />
      )}
    </div>
  )
}
