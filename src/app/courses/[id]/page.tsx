"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const COURSES = [
  {
    id: 1,
    title: "Mathematics",
    description: "Master core mathematical concepts and problem-solving techniques",
    level: "IGCSE",
    duration: "12 weeks",
    students: 1250,
    rating: 4.8,
    image: "📐",
    fullDescription:
      "This comprehensive Mathematics course covers all essential IGCSE topics including algebra, geometry, trigonometry, and calculus. Learn from experienced instructors with proven track records of student success.",
    instructors: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        bio: "PhD in Mathematics with 15+ years of teaching experience",
        meetLink: "https://meet.google.com/abc-defg-hij",
        schedule: "Monday & Wednesday, 6:00 PM - 7:30 PM (UTC)",
        classes: [
          { id: 1, name: "Class A", time: "Monday & Wednesday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 28 },
          { id: 2, name: "Class B", time: "Tuesday & Thursday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 25 },
        ],
      },
      {
        id: 2,
        name: "Prof. Robert Lee",
        bio: "MA in Mathematics with 10+ years of teaching experience",
        meetLink: "https://meet.google.com/xyz-uvwx-yz",
        schedule: "Tuesday & Friday, 7:00 PM - 8:30 PM (UTC)",
        classes: [
          { id: 3, name: "Class C", time: "Tuesday & Friday, 7:00 PM - 8:30 PM (UTC)", capacity: 30, enrolled: 22 },
          { id: 4, name: "Class D", time: "Wednesday & Saturday, 7:00 PM - 8:30 PM (UTC)", capacity: 30, enrolled: 26 },
        ],
      },
      {
        id: 3,
        name: "Dr. Amanda White",
        bio: "PhD in Applied Mathematics with 12+ years of teaching experience",
        meetLink: "https://meet.google.com/pqr-stuv-wx",
        schedule: "Thursday & Sunday, 5:00 PM - 6:30 PM (UTC)",
        classes: [
          { id: 5, name: "Class E", time: "Thursday & Sunday, 5:00 PM - 6:30 PM (UTC)", capacity: 30, enrolled: 29 },
          { id: 6, name: "Class F", time: "Saturday & Sunday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 24 },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "English Language",
    description: "Develop advanced reading, writing, and communication skills",
    level: "IGCSE",
    duration: "10 weeks",
    students: 980,
    rating: 4.9,
    image: "📚",
    fullDescription:
      "Enhance your English language skills with our comprehensive course covering literature analysis, essay writing, and communication techniques.",
    instructors: [
      {
        id: 1,
        name: "Prof. Michael Chen",
        bio: "MA in English Literature with 12+ years of teaching experience",
        meetLink: "https://meet.google.com/abc-mnop-qr",
        schedule: "Tuesday & Thursday, 5:00 PM - 6:30 PM (UTC)",
        classes: [
          { id: 1, name: "Class A", time: "Tuesday & Thursday, 5:00 PM - 6:30 PM (UTC)", capacity: 30, enrolled: 28 },
          { id: 2, name: "Class B", time: "Monday & Wednesday, 5:00 PM - 6:30 PM (UTC)", capacity: 30, enrolled: 25 },
        ],
      },
      {
        id: 2,
        name: "Dr. Emily Thompson",
        bio: "PhD in English with 14+ years of teaching experience",
        meetLink: "https://meet.google.com/def-ghij-kl",
        schedule: "Wednesday & Friday, 6:00 PM - 7:30 PM (UTC)",
        classes: [
          { id: 3, name: "Class C", time: "Wednesday & Friday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 20 },
          { id: 4, name: "Class D", time: "Thursday & Saturday, 5:00 PM - 6:30 PM (UTC)", capacity: 30, enrolled: 27 },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Physics",
    description: "Explore fundamental physics principles and real-world applications",
    level: "IGCSE",
    duration: "14 weeks",
    students: 750,
    rating: 4.7,
    image: "⚛️",
    fullDescription:
      "Discover the principles of physics through interactive lessons and practical experiments. Master mechanics, electricity, waves, and modern physics.",
    instructors: [
      {
        id: 1,
        name: "Dr. Emma Wilson",
        bio: "PhD in Physics with 10+ years of teaching experience",
        meetLink: "https://meet.google.com/mno-pqrs-tu",
        schedule: "Monday & Friday, 7:00 PM - 8:30 PM (UTC)",
        classes: [
          { id: 1, name: "Class A", time: "Monday & Friday, 7:00 PM - 8:30 PM (UTC)", capacity: 30, enrolled: 28 },
          { id: 2, name: "Class B", time: "Tuesday & Thursday, 7:00 PM - 8:30 PM (UTC)", capacity: 30, enrolled: 25 },
        ],
      },
      {
        id: 2,
        name: "Prof. David Kumar",
        bio: "MA in Physics with 11+ years of teaching experience",
        meetLink: "https://meet.google.com/vwx-yzab-cd",
        schedule: "Wednesday & Saturday, 6:00 PM - 7:30 PM (UTC)",
        classes: [
          { id: 3, name: "Class C", time: "Wednesday & Saturday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 22 },
          { id: 4, name: "Class D", time: "Sunday & Monday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 26 },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Chemistry",
    description: "Understand chemical reactions and molecular structures",
    level: "IGCSE",
    duration: "14 weeks",
    students: 680,
    rating: 4.8,
    image: "🧪",
    fullDescription:
      "Learn the fundamentals of chemistry including atomic structure, bonding, reactions, and organic chemistry through engaging lessons.",
    instructors: [
      {
        id: 1,
        name: "Dr. James Brown",
        bio: "PhD in Chemistry with 13+ years of teaching experience",
        meetLink: "https://meet.google.com/efg-hijk-lm",
        schedule: "Wednesday & Saturday, 6:00 PM - 7:30 PM (UTC)",
        classes: [
          { id: 1, name: "Class A", time: "Wednesday & Saturday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 28 },
          { id: 2, name: "Class B", time: "Thursday & Sunday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 25 },
        ],
      },
      {
        id: 2,
        name: "Dr. Patricia Garcia",
        bio: "PhD in Organic Chemistry with 9+ years of teaching experience",
        meetLink: "https://meet.google.com/nop-qrst-uv",
        schedule: "Monday & Thursday, 5:30 PM - 7:00 PM (UTC)",
        classes: [
          { id: 3, name: "Class C", time: "Monday & Thursday, 5:30 PM - 7:00 PM (UTC)", capacity: 30, enrolled: 23 },
          { id: 4, name: "Class D", time: "Tuesday & Friday, 5:30 PM - 7:00 PM (UTC)", capacity: 30, enrolled: 27 },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Biology",
    description: "Study living organisms and biological processes",
    level: "IGCSE",
    duration: "12 weeks",
    students: 920,
    rating: 4.9,
    image: "🔬",
    fullDescription:
      "Explore the diversity of life and understand biological processes at cellular and organismal levels.",
    instructors: [
      {
        id: 1,
        name: "Dr. Lisa Anderson",
        bio: "PhD in Biology with 14+ years of teaching experience",
        meetLink: "https://meet.google.com/wxy-zabc-de",
        schedule: "Tuesday & Friday, 5:30 PM - 7:00 PM (UTC)",
        classes: [
          { id: 1, name: "Class A", time: "Tuesday & Friday, 5:30 PM - 7:00 PM (UTC)", capacity: 30, enrolled: 28 },
          { id: 2, name: "Class B", time: "Monday & Wednesday, 5:30 PM - 7:00 PM (UTC)", capacity: 30, enrolled: 25 },
        ],
      },
      {
        id: 2,
        name: "Prof. Marcus Johnson",
        bio: "MA in Molecular Biology with 8+ years of teaching experience",
        meetLink: "https://meet.google.com/fgh-ijkl-mn",
        schedule: "Thursday & Saturday, 6:00 PM - 7:30 PM (UTC)",
        classes: [
          { id: 3, name: "Class C", time: "Thursday & Saturday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 21 },
          { id: 4, name: "Class D", time: "Wednesday & Sunday, 6:00 PM - 7:30 PM (UTC)", capacity: 30, enrolled: 28 },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "History",
    description: "Explore historical events and their global impact",
    level: "IGCSE",
    duration: "11 weeks",
    students: 540,
    rating: 4.6,
    image: "📜",
    fullDescription:
      "Understand major historical events and their impact on modern society through critical analysis and discussion.",
    instructors: [
      {
        id: 1,
        name: "Prof. David Martinez",
        bio: "MA in History with 11+ years of teaching experience",
        meetLink: "https://meet.google.com/opq-rstu-vw",
        schedule: "Monday & Thursday, 4:00 PM - 5:30 PM (UTC)",
        classes: [
          { id: 1, name: "Class A", time: "Monday & Thursday, 4:00 PM - 5:30 PM (UTC)", capacity: 30, enrolled: 28 },
          { id: 2, name: "Class B", time: "Tuesday & Friday, 4:00 PM - 5:30 PM (UTC)", capacity: 30, enrolled: 25 },
        ],
      },
      {
        id: 2,
        name: "Dr. Victoria Hayes",
        bio: "PhD in Modern History with 13+ years of teaching experience",
        meetLink: "https://meet.google.com/xyz-defg-hi",
        schedule: "Wednesday & Saturday, 4:00 PM - 5:30 PM (UTC)",
        classes: [
          { id: 3, name: "Class C", time: "Wednesday & Saturday, 4:00 PM - 5:30 PM (UTC)", capacity: 30, enrolled: 19 },
          { id: 4, name: "Class D", time: "Sunday & Monday, 4:00 PM - 5:30 PM (UTC)", capacity: 30, enrolled: 26 },
        ],
      },
    ],
  },
]

const generateLearningSlots = () => {
  const slots = []
  const startDate = new Date(2024, 0, 8)

  for (let i = 0; i < 20; i++) {
    const weekNumber = Math.floor(i / 2) + 1
    const slotInWeek = (i % 2) + 1
    const daysToAdd = i * 3.5
    const slotDate = new Date(startDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)

    slots.push({
      id: i + 1,
      weekNumber,
      slotInWeek,
      date: slotDate,
      time: slotInWeek === 1 ? "6:00 PM - 7:30 PM" : "7:45 PM - 9:15 PM",
      topic: [
        "Algebra Fundamentals",
        "Geometry Basics",
        "Trigonometry",
        "Calculus Intro",
        "Functions",
        "Sequences",
        "Probability",
        "Statistics",
        "Vectors",
        "Complex Numbers",
      ][i % 10],
    })
  }

  return slots
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = Number.parseInt(params.id as string)
  const course = COURSES.find((c) => c.id === courseId)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(course?.instructors[0] || null)
  const [selectedClass, setSelectedClass] = useState(selectedInstructor?.classes[0] || null)
  const [activeTab, setActiveTab] = useState<"slots" | "quizzes" | "assignments">("slots")
  const learningSlots = generateLearningSlots()

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-xl text-muted-foreground">Course not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  const handleInstructorChange = (instructor: (typeof course.instructors)[0]) => {
    setSelectedInstructor(instructor)
    setSelectedClass(instructor.classes[0])
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {!isEnrolled ? (
          // Course Overview
          <div className="w-full">
            {/* Hero Section */}
            <section className="w-full py-16 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-start gap-8">
                  <div className="text-7xl">{course.image}</div>
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{course.title}</h1>
                    <p className="text-xl text-muted-foreground mb-6">{course.fullDescription}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-lg font-semibold text-foreground">Rating: {course.rating}</span>
                      <span className="text-lg font-semibold text-foreground">
                        {course.students.toLocaleString()} students
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-16 bg-card border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">Select Your Instructor</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {course.instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      onClick={() => handleInstructorChange(instructor)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedInstructor?.id === instructor.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-foreground mb-2">{instructor.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{instructor.bio}</p>
                      <p className="text-sm font-semibold text-primary">{instructor.schedule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Course Details */}
            <section className="w-full py-16 bg-background">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left Column */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Course Information</h2>
                    <div className="space-y-6">
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Level</p>
                        <p className="text-lg font-semibold text-foreground">{course.level}</p>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Duration</p>
                        <p className="text-lg font-semibold text-foreground">{course.duration}</p>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Schedule</p>
                        <p className="text-lg font-semibold text-foreground">{selectedInstructor?.schedule}</p>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Meet Link</p>
                        <p className="text-lg font-semibold text-foreground">Available after enrollment</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Instructor Details</h2>
                    <div className="p-6 bg-card border border-border rounded-lg mb-8">
                      <p className="text-2xl font-bold text-foreground mb-2">{selectedInstructor?.name}</p>
                      <p className="text-muted-foreground mb-6">{selectedInstructor?.bio}</p>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground mb-6">What You Learn</h2>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-foreground">Comprehensive understanding of core concepts</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-foreground">Problem-solving and analytical skills</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-foreground">Exam preparation and practice tests</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-foreground">One-on-one support from instructors</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Enrollment Section */}
            <section className="w-full py-16 bg-card border-t border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8">Select Your Class</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {selectedInstructor?.classes.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClass(cls)}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedClass?.id === cls.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-foreground mb-3">{cls.name}</h3>
                      <p className="text-muted-foreground mb-3">{cls.time}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {cls.enrolled}/{cls.capacity} students
                        </span>
                        <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsEnrolled(true)}
                  className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity"
                >
                  Enroll in {selectedClass?.name}
                </button>
              </div>
            </section>
          </div>
        ) : (
          // Enrolled View
          <div className="w-full py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-12">
                <button
                  onClick={() => setIsEnrolled(false)}
                  className="text-primary hover:underline mb-4 font-semibold"
                >
                  ← Back to Course
                </button>
                <h1 className="text-4xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-lg text-muted-foreground">
                  Enrolled in {selectedClass?.name} - {selectedClass?.time}
                </p>
              </div>

              {/* Progress Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
                  <p className="text-3xl font-bold text-primary mb-3">65%</p>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "65%" }} />
                  </div>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Completed Slots</p>
                  <p className="text-3xl font-bold text-primary">13/20</p>
                </div>
                <div className="p-6 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Quiz Average</p>
                  <p className="text-3xl font-bold text-primary">87%</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex gap-4 border-b border-border">
                  <button
                    onClick={() => setActiveTab("slots")}
                    className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                      activeTab === "slots"
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
                  >
                    Learning Slots
                  </button>
                  <button
                    onClick={() => setActiveTab("quizzes")}
                    className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                      activeTab === "quizzes"
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
                  >
                    Quizzes
                  </button>
                  <button
                    onClick={() => setActiveTab("assignments")}
                    className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                      activeTab === "assignments"
                        ? "text-primary border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground"
                    }`}
                  >
                    Assignments
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "slots" && (
                // Learning Slots
                <div className="space-y-4">
                  {learningSlots.map((slot, i) => {
                    const isCompleted = i < 13

                    return (
                      <div
                        key={slot.id}
                        className={`p-4 border rounded-lg transition-all ${
                          isCompleted
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                isCompleted ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? "✓" : slot.id}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                Week {slot.weekNumber} - Slot {slot.slotInWeek}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {slot.date.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                at {slot.time}
                              </p>
                              <p className="text-sm text-muted-foreground">Topic: {slot.topic}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {isCompleted && <span className="text-sm font-semibold text-primary">Completed</span>}
                            <a
                              href={selectedInstructor?.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                isCompleted
                                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                                  : "bg-primary text-primary-foreground hover:opacity-90"
                              }`}
                            >
                              {isCompleted ? "Replay" : "Join"}
                            </a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === "quizzes" && (
                <div className="space-y-4">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const isCompleted = i < 13
                    const quizNumber = i + 1
                    const weekNumber = Math.ceil(quizNumber / 2)
                    const score = isCompleted ? Math.floor(Math.random() * 30) + 70 : null

                    return (
                      <div
                        key={i}
                        className={`p-4 border rounded-lg transition-all ${
                          isCompleted
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                isCompleted ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? "✓" : quizNumber}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                Quiz {quizNumber} - Week {weekNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {isCompleted ? `Score: ${score}%` : "Not yet completed"}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              isCompleted
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            {isCompleted ? "Review" : "Start Quiz"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === "assignments" && (
                <div className="space-y-4">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const assignmentNumber = i + 1
                    const weekNumber = (i + 1) * 2
                    const isCompleted = i < 6
                    const score = isCompleted ? Math.floor(Math.random() * 20) + 80 : null
                    const dueDate = new Date(2024, 0, 1 + weekNumber * 7)

                    return (
                      <div
                        key={i}
                        className={`p-4 border rounded-lg transition-all ${
                          isCompleted
                            ? "bg-primary/5 border-primary/30"
                            : "bg-card border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                                isCompleted ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                              }`}
                            >
                              {isCompleted ? "✓" : assignmentNumber}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                Assignment {assignmentNumber} - Week {weekNumber}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {isCompleted ? `Submitted - Score: ${score}%` : `Due: ${dueDate.toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          <button
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              isCompleted
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-primary text-primary-foreground hover:opacity-90"
                            }`}
                          >
                            {isCompleted ? "View Feedback" : "Submit"}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
