'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeacherQuizCreateDialog } from '@/components/teacher/quiz-create-dialog'
import { QuizEditDialog } from '@/components/admin/quizzes/quiz-edit-dialog'
import {
  Quiz,
  deleteQuiz,
  getQuizzes,
} from '@/services/quizService'
import {
  Calendar,
  FileQuestion,
  Hash,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface TeacherQuizManagementProps {
  courseId: number
}

export function TeacherQuizManagement({ courseId }: TeacherQuizManagementProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuizzes()
  }, [courseId])

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Fetch all quizzes and filter by courseId
      const response = await getQuizzes(1, 100)
      const courseQuizzes = response.data.filter(q => q.courseId === courseId)
      setQuizzes(courseQuizzes)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch quizzes')
      console.error('Error fetching quizzes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id)
        fetchQuizzes()
      } catch (err) {
        const error = err as Error
        alert(error.message || 'Failed to delete quiz')
      }
    }
  }

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz)
    setEditOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quizzes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage quizzes for this course
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
          Create Quiz
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-primary" />
              <CardTitle>Course Quizzes</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {quizzes.length} Total
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <FileQuestion className="mx-auto h-12 w-12 opacity-20" />
              <p className="mt-4">No quizzes found. Create your first quiz!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30 text-left">
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      ID
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Quiz Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Questions
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Created Date
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr
                      key={quiz.id}
                      className="border-b transition-colors hover:bg-muted/50 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {quiz.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileQuestion className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">
                            {quiz.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {quiz.totalQuestions} questions
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(quiz.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleEdit(quiz)}
                            title="Edit quiz"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(quiz.id)}
                            title="Delete quiz"
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
          )}
        </CardContent>
      </Card>

      <TeacherQuizCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchQuizzes}
        courseId={courseId}
      />

      <QuizEditDialog
        quiz={editingQuiz}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={fetchQuizzes}
      />
    </>
  )
}
