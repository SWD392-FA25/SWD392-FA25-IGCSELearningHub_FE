"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

interface Course {
  id: string
  name: string
  code: string
  description: string
  instructor: string
  progress: number
  nextClass: string
  status: "enrolled" | "completed" | "available"
}

const STUDENT_COURSES: Course[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "IGCSE-MATH-001",
    description: "Comprehensive IGCSE Mathematics course covering algebra, geometry, and calculus",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    nextClass: "Monday, 10:00 AM",
    status: "enrolled",
  },
  {
    id: "2",
    name: "Physics",
    code: "IGCSE-PHY-001",
    description: "IGCSE Physics course covering mechanics, electricity, and waves",
    instructor: "Prof. Michael Chen",
    progress: 60,
    nextClass: "Tuesday, 2:00 PM",
    status: "enrolled",
  },
  {
    id: "3",
    name: "Chemistry",
    code: "IGCSE-CHEM-001",
    description: "IGCSE Chemistry course covering atomic structure, bonding, and reactions",
    instructor: "Dr. Emma Wilson",
    progress: 100,
    nextClass: "Completed",
    status: "completed",
  },
  {
    id: "4",
    name: "Biology",
    code: "IGCSE-BIO-001",
    description: "IGCSE Biology course covering cells, genetics, and ecology",
    instructor: "Dr. Robert Smith",
    progress: 0,
    nextClass: "Available to enroll",
    status: "available",
  },
]

export default function StudentPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "available":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    return "bg-yellow-500"
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-background">
        {/* Header Section */}
        <section className="w-full py-12 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Student Dashboard</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Track your progress, manage your courses, and excel in your IGCSE studies
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Stats */}
        <section className="w-full py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-2xl font-bold text-foreground">3</h3>
                <p className="text-muted-foreground">Enrolled Courses</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-2xl font-bold text-foreground">65%</h3>
                <p className="text-muted-foreground">Average Progress</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-2xl font-bold text-foreground">1</h3>
                <p className="text-muted-foreground">Completed Courses</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-2xl font-bold text-foreground">12</h3>
                <p className="text-muted-foreground">Hours This Week</p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {STUDENT_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{course.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{course.code}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Instructor:</span> {course.instructor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Next Class:</span> {course.nextClass}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    {course.status === "enrolled" && (
                      <Link
                        href={`/student/courses/${course.id}`}
                        className="w-full inline-block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Continue Learning
                      </Link>
                    )}
                    {course.status === "completed" && (
                      <Link
                        href={`/student/courses/${course.id}/certificate`}
                        className="w-full inline-block text-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        View Certificate
                      </Link>
                    )}
                    {course.status === "available" && (
                      <button className="w-full px-4 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}