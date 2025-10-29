"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState } from "react"
import { useParams } from "next/navigation"

interface Class {
  id: string
  name: string
  schedule: string
  capacity: number
  enrolled: number
  instructor: string
  meetLink?: string
}

const CLASSES_DATA: Record<string, Class[]> = {
  "1": [
    {
      id: "1",
      name: "Mathematics - Class A",
      schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
      capacity: 30,
      enrolled: 28,
      instructor: "Dr. Sarah Johnson",
    },
    {
      id: "2",
      name: "Mathematics - Class B",
      schedule: "Tue, Thu 2:00 PM - 3:30 PM",
      capacity: 30,
      enrolled: 25,
      instructor: "Dr. Sarah Johnson",
    },
  ],
  "2": [
    {
      id: "3",
      name: "Physics - Class A",
      schedule: "Mon, Wed 1:00 PM - 2:30 PM",
      capacity: 30,
      enrolled: 25,
      instructor: "Prof. Michael Chen",
    },
    {
      id: "4",
      name: "Physics - Class B",
      schedule: "Tue, Thu 10:00 AM - 11:30 AM",
      capacity: 30,
      enrolled: 22,
      instructor: "Prof. Michael Chen",
    },
  ],
  "3": [
    {
      id: "5",
      name: "Chemistry - Class A",
      schedule: "Mon, Wed, Fri 2:00 PM - 3:30 PM",
      capacity: 30,
      enrolled: 22,
      instructor: "Dr. Emma Wilson",
    },
  ],
  "4": [
    {
      id: "6",
      name: "Biology - Class A",
      schedule: "Tue, Thu, Sat 10:00 AM - 11:30 AM",
      capacity: 30,
      enrolled: 26,
      instructor: "Dr. James Brown",
    },
  ],
  "5": [
    {
      id: "7",
      name: "English Literature - Class A",
      schedule: "Mon, Wed 3:00 PM - 4:30 PM",
      capacity: 30,
      enrolled: 24,
      instructor: "Ms. Lisa Anderson",
    },
  ],
  "6": [
    {
      id: "8",
      name: "History - Class A",
      schedule: "Tue, Thu 1:00 PM - 2:30 PM",
      capacity: 30,
      enrolled: 20,
      instructor: "Dr. Robert Taylor",
    },
  ],
}

const COURSE_NAMES: Record<string, string> = {
  "1": "Mathematics",
  "2": "Physics",
  "3": "Chemistry",
  "4": "Biology",
  "5": "English Literature",
  "6": "History",
}

export default function ManageCoursePage() {
  const params = useParams()
  const courseId = params.courseId as string
  const courseName = COURSE_NAMES[courseId] || "Course"
  const classes = CLASSES_DATA[courseId] || []

  const [showAddClass, setShowAddClass] = useState(false)
  const [editingClass, setEditingClass] = useState<string | null>(null)
  const [newClassName, setNewClassName] = useState("")
  const [newClassSchedule, setNewClassSchedule] = useState("")

  const handleAddClass = () => {
    if (newClassName && newClassSchedule) {
      setShowAddClass(false)
      setNewClassName("")
      setNewClassSchedule("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/teacher" className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage {courseName}</h1>
          <p className="text-muted-foreground">Manage your classes and learning slots</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAddClass(!showAddClass)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {showAddClass ? "Cancel" : "+ Add New Class"}
          </button>
        </div>

        {showAddClass && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Add New Class</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g., Mathematics - Class C"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Schedule</label>
                <input
                  type="text"
                  value={newClassSchedule}
                  onChange={(e) => setNewClassSchedule(e.target.value)}
                  placeholder="e.g., Mon, Wed, Fri 10:00 AM - 11:30 AM"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={handleAddClass}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Create Class
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-card border border-border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-foreground mb-1">{classItem.name}</h3>
                <p className="text-sm text-muted-foreground">{classItem.schedule}</p>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enrolled:</span>
                  <span className="text-foreground font-medium">
                    {classItem.enrolled}/{classItem.capacity}
                  </span>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(classItem.enrolled / classItem.capacity) * 100}%` }}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingClass(editingClass === classItem.id ? null : classItem.id)}
                  className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Edit
                </button>
                <Link
                  href={`/teacher/${courseId}/${classItem.id}/slots`}
                  className="flex-1 text-center px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Manage Slots
                </Link>
              </div>

              {editingClass === classItem.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="space-y-3">
                    <input
                      type="text"
                      defaultValue={classItem.name}
                      placeholder="Class name"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      defaultValue={classItem.schedule}
                      placeholder="Schedule"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
