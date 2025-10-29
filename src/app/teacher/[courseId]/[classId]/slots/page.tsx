"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { useState } from "react"
import { useParams } from "next/navigation"

interface Slot {
  id: string
  week: number
  date: string
  time: string
  topic: string
  meetLink?: string
  quizzes: Quiz[]
  assignments: Assignment[]
}

interface Quiz {
  id: string
  title: string
  questions: number
  duration: number
  passingScore: number
}

interface Assignment {
  id: string
  title: string
  dueDate: string
  points: number
}

const SLOTS_DATA: Record<string, Slot[]> = {
  "1": [
    {
      id: "1",
      week: 1,
      date: "Mon, Jan 08",
      time: "10:00 AM - 11:30 AM",
      topic: "Introduction to Algebra",
      meetLink: "https://meet.google.com/abc-defg-hij",
      quizzes: [{ id: "q1", title: "Algebra Basics", questions: 10, duration: 30, passingScore: 70 }],
      assignments: [],
    },
    {
      id: "2",
      week: 1,
      date: "Wed, Jan 10",
      time: "10:00 AM - 11:30 AM",
      topic: "Linear Equations",
      meetLink: "https://meet.google.com/abc-defg-hij",
      quizzes: [{ id: "q2", title: "Linear Equations Quiz", questions: 8, duration: 25, passingScore: 70 }],
      assignments: [],
    },
    {
      id: "3",
      week: 2,
      date: "Mon, Jan 15",
      time: "10:00 AM - 11:30 AM",
      topic: "Quadratic Equations",
      meetLink: "https://meet.google.com/abc-defg-hij",
      quizzes: [{ id: "q3", title: "Quadratic Equations Quiz", questions: 10, duration: 30, passingScore: 70 }],
      assignments: [{ id: "a1", title: "Quadratic Problems Set", dueDate: "Jan 17", points: 50 }],
    },
  ],
}

const CLASS_NAMES: Record<string, string> = {
  "1": "Mathematics - Class A",
  "2": "Mathematics - Class B",
  "3": "Physics - Class A",
  "4": "Physics - Class B",
  "5": "Chemistry - Class A",
  "6": "Biology - Class A",
  "7": "English Literature - Class A",
  "8": "History - Class A",
}

export default function ManageSlotsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const classId = params.classId as string
  const className = CLASS_NAMES[classId] || "Class"

  const slots = SLOTS_DATA[classId] || []
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null)
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [newSlotTopic, setNewSlotTopic] = useState("")
  const [newSlotDate, setNewSlotDate] = useState("")
  const [newSlotTime, setNewSlotTime] = useState("")

  const handleAddSlot = () => {
    if (newSlotTopic && newSlotDate && newSlotTime) {
      setShowAddSlot(false)
      setNewSlotTopic("")
      setNewSlotDate("")
      setNewSlotTime("")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href={`/teacher/${courseId}/manage`} className="text-primary hover:underline text-sm mb-4 inline-block">
            ← Back to Course
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Manage Learning Slots</h1>
          <p className="text-muted-foreground">{className}</p>
        </div>

        <div className="mb-8">
          <button
            onClick={() => setShowAddSlot(!showAddSlot)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {showAddSlot ? "Cancel" : "+ Add New Slot"}
          </button>
        </div>

        {showAddSlot && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-foreground mb-4">Add New Learning Slot</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Topic</label>
                <input
                  type="text"
                  value={newSlotTopic}
                  onChange={(e) => setNewSlotTopic(e.target.value)}
                  placeholder="e.g., Introduction to Calculus"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="text"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    placeholder="e.g., Mon, Jan 22"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                  <input
                    type="text"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    placeholder="e.g., 10:00 AM - 11:30 AM"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <button
                onClick={handleAddSlot}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Create Slot
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedSlot(expandedSlot === slot.id ? null : slot.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-lg font-bold text-foreground">
                    Week {slot.week}: {slot.topic}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {slot.date} • {slot.time}
                  </p>
                </div>
                <svg
                  className={`w-5 h-5 text-foreground transition-transform ${
                    expandedSlot === slot.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {expandedSlot === slot.id && (
                <div className="border-t border-border px-6 py-4 bg-muted/30 space-y-6">
                  {/* Google Meet Link Section */}
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Google Meet Link</h4>
                    {slot.meetLink ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={slot.meetLink}
                          readOnly
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                        />
                        <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                          Copy
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Paste Google Meet link here"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>

                  {/* Quizzes Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-foreground">Quizzes</h4>
                      <button className="text-sm text-primary hover:underline">+ Add Quiz</button>
                    </div>
                    {slot.quizzes.length > 0 ? (
                      <div className="space-y-2">
                        {slot.quizzes.map((quiz) => (
                          <div key={quiz.id} className="bg-background border border-border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{quiz.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {quiz.questions} questions • {quiz.duration} min • {quiz.passingScore}% pass
                                </p>
                              </div>
                              <button className="text-muted-foreground hover:text-foreground">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No quizzes added yet</p>
                    )}
                  </div>

                  {/* Assignments Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-foreground">Assignments</h4>
                      <button className="text-sm text-primary hover:underline">+ Add Assignment</button>
                    </div>
                    {slot.assignments.length > 0 ? (
                      <div className="space-y-2">
                        {slot.assignments.map((assignment) => (
                          <div key={assignment.id} className="bg-background border border-border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{assignment.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Due: {assignment.dueDate} • {assignment.points} points
                                </p>
                              </div>
                              <button className="text-muted-foreground hover:text-foreground">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No assignments added yet</p>
                    )}
                  </div>

                  {/* Edit/Delete Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg font-medium text-sm hover:bg-muted/80 transition-colors">
                      Edit Slot
                    </button>
                    <button className="flex-1 px-3 py-2 bg-red-500/10 text-red-600 rounded-lg font-medium text-sm hover:bg-red-500/20 transition-colors">
                      Delete Slot
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
