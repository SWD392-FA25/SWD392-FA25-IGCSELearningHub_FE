"use client"
import Link from "next/link"
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
  },
]

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="w-full py-16 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Courses</h1>
            <p className="text-lg text-muted-foreground">
              Choose from our comprehensive selection of IGCSE courses taught by expert instructors
            </p>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COURSES.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group p-6 border border-border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer bg-card"
                >
                  <div className="text-5xl mb-4">{course.image}</div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{course.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students</span>
                      <span className="font-medium text-foreground">{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium text-foreground">⭐ {course.rating}</span>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
                    View Details
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
