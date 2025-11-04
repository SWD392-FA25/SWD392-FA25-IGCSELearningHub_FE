"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Eye, Pencil, Trash2, Plus } from "lucide-react"
import { CourseDetailDialog } from "@/components/admin/courses/course-detail-dialog"
import { CourseEditDialog } from "@/components/admin/courses/course-edit-dialog"

interface Course {
  id: string
  name: string
  students: number
  teacher: string
  status: "Active" | "Disabled"
  progress: number
}

export default function CoursesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "C001",
      name: "Mathematics IGCSE",
      students: 45,
      teacher: "Dr. Smith",
      progress: 75,
      status: "Active",
    },
    {
      id: "C002",
      name: "English Literature",
      students: 38,
      teacher: "Ms. Johnson",
      progress: 60,
      status: "Active",
    },
    {
      id: "C003",
      name: "Physics Advanced",
      students: 32,
      teacher: "Prof. Williams",
      progress: 85,
      status: "Disabled",
    },
    {
      id: "C004",
      name: "Chemistry Core",
      students: 41,
      teacher: "Dr. Brown",
      progress: 50,
      status: "Active",
    },
  ])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((c) => c.id !== id))
    }
  }

  const handleViewDetail = (course: Course) => {
    setSelectedCourse(course)
    setDetailOpen(true)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
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
                <h1 className="text-3xl font-bold">Course Management</h1>
                <p className="mt-1 text-muted-foreground">Manage all courses and their details</p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">ID</th>
                        <th className="pb-3 font-medium text-muted-foreground">Course Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Students</th>
                        <th className="pb-3 font-medium text-muted-foreground">Teacher</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Progress</th>
                        <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium">{course.id}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">{course.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm">{course.students}</td>
                          <td className="py-4 text-sm">{course.teacher}</td>
                          <td className="py-4">
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
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{course.progress}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleViewDetail(course)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(course)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => handleDelete(course.id)}
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

      {selectedCourse && <CourseDetailDialog course={selectedCourse} open={detailOpen} onOpenChange={setDetailOpen} />}

      {editingCourse && <CourseEditDialog course={editingCourse} open={editOpen} onOpenChange={setEditOpen} />}
    </div>
  )
}
