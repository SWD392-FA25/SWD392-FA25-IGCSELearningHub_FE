"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState } from "react"

interface Course {
  id: string
  name: string
  code: string
  description: string
  instructor: string
  students: number
  capacity: number
}

const TEACHER_COURSES: Course[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "IGCSE-MATH-001",
    description: "Comprehensive IGCSE Mathematics course covering algebra, geometry, and calculus",
    instructor: "Dr. Sarah Johnson",
    students: 28,
    capacity: 30,
  },
  {
    id: "2",
    name: "Physics",
    code: "IGCSE-PHY-001",
    description: "IGCSE Physics course covering mechanics, electricity, and waves",
    instructor: "Prof. Michael Chen",
    students: 25,
    capacity: 30,
  },
  {
    id: "3",
    name: "Chemistry",
    code: "IGCSE-CHEM-001",
    description: "IGCSE Chemistry course covering atomic structure, bonding, and reactions",
    instructor: "Dr. Emma Wilson",
    students: 22,
    capacity: 30,
  },
  {
    id: "4",
    name: "Biology",
    code: "IGCSE-BIO-001",
    description: "IGCSE Biology course covering cells, genetics, and ecology",
    instructor: "Dr. James Brown",
    students: 26,
    capacity: 30,
  },
  {
    id: "5",
    name: "English Literature",
    code: "IGCSE-ENG-001",
    description: "IGCSE English Literature course covering poetry, prose, and drama",
    instructor: "Ms. Lisa Anderson",
    students: 24,
    capacity: 30,
  },
  {
    id: "6",
    name: "History",
    code: "IGCSE-HIST-001",
    description: "IGCSE History course covering world history and modern conflicts",
    instructor: "Dr. Robert Taylor",
    students: 20,
    capacity: 30,
  },
]

export default function TeacherDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and classes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEACHER_COURSES.map((course) => (
            <div
              key={course.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1">{course.name}</h3>
                <p className="text-sm text-muted-foreground">{course.code}</p>
              </div>

              <p className="text-sm text-foreground mb-4 line-clamp-2">{course.description}</p>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="text-foreground font-medium">{course.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Students:</span>
                  <span className="text-foreground font-medium">
                    {course.students}/{course.capacity}
                  </span>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(course.students / course.capacity) * 100}%` }}
                />
              </div>

              <Link
                href={`/teacher/${course.id}/manage`}
                className="w-full inline-block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Manage Course
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
