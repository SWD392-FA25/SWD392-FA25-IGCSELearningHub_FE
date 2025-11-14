'use client'

import { TeacherHeader } from '@/components/layout/teacher-header'
import { TeacherFooter } from '@/components/layout/teacher-footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCourseById, Course } from '@/services/courseService'
import {
  BookOpen,
  FileQuestion,
  FileText,
  Video,
  ArrowLeft,
} from 'lucide-react'
import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TeacherQuizManagement } from '@/components/teacher/quiz-management'
import { TeacherAssignmentManagement } from '@/components/teacher/assignment-management'
import { TeacherLivestreamManagement } from '@/components/teacher/livestream-management'

type TabType = 'quizzes' | 'assignments' | 'livestreams'

export default function TeacherCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const router = useRouter()
  const { courseId: courseIdString } = use(params)
  const courseId = parseInt(courseIdString)
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('quizzes')

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const courseData = await getCourseById(courseId)
      setCourse(courseData)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch course details')
      console.error('Error fetching course:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    {
      id: 'quizzes' as TabType,
      label: 'Quizzes',
      icon: FileQuestion,
    },
    {
      id: 'assignments' as TabType,
      label: 'Assignments',
      icon: FileText,
    },
    {
      id: 'livestreams' as TabType,
      label: 'Livestreams',
      icon: Video,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <TeacherHeader />

      <main className="flex-1 bg-background">
          <div className="container mx-auto max-w-full px-4 py-8 md:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href="/teacher/courses"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Courses
            </Link>

            {/* Course Header */}
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4">Loading course...</p>
              </div>
            ) : error ? (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            ) : course ? (
              <>
                <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">
                          {course.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="font-medium">Level: {course.level}</span>
                          <span>•</span>
                          <span className="font-medium">Price: ${course.price.toLocaleString()}</span>
                          <span>•</span>
                          <span>Course ID: {course.id}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Tabs */}
                <div className="border-b mb-6">
                  <div className="flex gap-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                            activeTab === tab.id
                              ? 'border-primary text-primary'
                              : 'border-transparent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                  {activeTab === 'quizzes' && (
                    <TeacherQuizManagement courseId={courseId} />
                  )}
                  {activeTab === 'assignments' && (
                    <TeacherAssignmentManagement courseId={courseId} />
                  )}
                  {activeTab === 'livestreams' && (
                    <TeacherLivestreamManagement courseId={courseId} />
                  )}
                </div>
              </>
            ) : null}
        </div>
      </main>

      <TeacherFooter />
    </div>
  )
}
