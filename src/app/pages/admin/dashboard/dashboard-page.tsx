"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { StatsCard } from "@/components/layout/stats-card"
import { BookOpen, Users, GraduationCap, School } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const courses = [
    {
      id: 1,
      name: "Mathematics IGCSE",
      students: 45,
      teacher: "Dr. Smith",
      progress: 75,
      status: "Active",
    },
    {
      id: 2,
      name: "English Literature",
      students: 38,
      teacher: "Ms. Johnson",
      progress: 60,
      status: "Active",
    },
    {
      id: 3,
      name: "Physics Advanced",
      students: 32,
      teacher: "Prof. Williams",
      progress: 85,
      status: "Active",
    },
    {
      id: 4,
      name: "Chemistry Core",
      students: 41,
      teacher: "Dr. Brown",
      progress: 50,
      status: "Active",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto">
          {/* Hero Section with gradient */}
          <div className="bg-gradient-to-br from-[#624bff] to-[#8b7aff] px-4 py-12 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white md:text-4xl">Dashboard Overview</h1>
                  <p className="mt-2 text-white/90">Welcome back! Heres whats happening with your courses today.</p>
                </div>
                <Button className="bg-white text-[#624bff] hover:bg-white/90">Create New Course</Button>
              </div>

              {/* Stats Cards */}
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                  title="Total Courses"
                  value="24"
                  subtitle="4 Active"
                  icon={BookOpen}
                  iconColor="text-white"
                />
                <StatsCard
                  title="Total Students"
                  value="156"
                  subtitle="12 New this month"
                  icon={Users}
                  iconColor="text-white"
                />
                <StatsCard
                  title="Teachers"
                  value="18"
                  subtitle="2 On leave"
                  icon={GraduationCap}
                  iconColor="text-white"
                />
                <StatsCard
                  title="Classes"
                  value="32"
                  subtitle="8 Scheduled today"
                  icon={School}
                  iconColor="text-white"
                />
              </div>
            </div>
          </div>

          {/* Active Courses Table */}
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Active Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Course Name</th>
                        <th className="pb-3 font-medium text-muted-foreground">Students</th>
                        <th className="pb-3 font-medium text-muted-foreground">Teacher</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course) => (
                        <tr key={course.id} className="border-b border-border last:border-0">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">{course.name}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                  <Avatar key={i} className="h-7 w-7 border-2 border-card">
                                    <AvatarImage
                                      src={`/diverse-students-studying.png?height=28&width=28&query=student${i}`}
                                      alt={`Student ${i}`}
                                    />
                                    <AvatarFallback>S{i}</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">+{course.students - 3}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm">{course.teacher}</td>
                          <td className="py-4">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                              {course.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{course.progress}%</span>
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
    </div>
  )
}
