'use client'

import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createQuiz, Question, QuestionOption } from '@/services/quizService'
import { getCourses } from '@/services/courseService'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface QuizCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function QuizCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuizCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([])
  
  // Form state
  const [courseId, setCourseId] = useState('')
  const [title, setTitle] = useState('')
  const [timeLimitSeconds, setTimeLimitSeconds] = useState('3600')
  const [randomizeQuestions, setRandomizeQuestions] = useState(false)
  const [randomizeOptions, setRandomizeOptions] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([
    {
      stem: '',
      explanation: '',
      difficulty: 1,
      type: 'MultipleChoice',
      points: 1,
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ],
    },
  ])

  useEffect(() => {
    if (open) {
      fetchCourses()
    }
  }, [open])

  const fetchCourses = async () => {
    try {
      const response = await getCourses(1, 100)
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        stem: '',
        explanation: '',
        difficulty: 1,
        type: 'MultipleChoice',
        points: 1,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ])
  }

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false })
    setQuestions(newQuestions)
  }

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter(
      (_, i) => i !== optionIndex
    )
    setQuestions(newQuestions)
  }

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    field: keyof QuestionOption,
    value: any
  ) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      [field]: value,
    }
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!courseId || !title) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      await createQuiz({
        courseId: parseInt(courseId),
        title,
        timeLimitSeconds: parseInt(timeLimitSeconds),
        randomizeQuestions,
        randomizeOptions,
        questions,
      })

      // Reset form
      setCourseId('')
      setTitle('')
      setTimeLimitSeconds('3600')
      setRandomizeQuestions(false)
      setRandomizeOptions(false)
      setQuestions([
        {
          stem: '',
          explanation: '',
          difficulty: 1,
          type: 'MultipleChoice',
          points: 1,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ])

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      const error = err as Error
      alert(error.message || 'Failed to create quiz')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogDescription>Add a new quiz to the system</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="courseId">
                Course <span className="text-destructive">*</span>
              </Label>
              <select
                id="courseId"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="title">
                Quiz Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="timeLimitSeconds">Time Limit (seconds)</Label>
              <Input
                id="timeLimitSeconds"
                type="number"
                value={timeLimitSeconds}
                onChange={(e) => setTimeLimitSeconds(e.target.value)}
                placeholder="3600"
                className="mt-2"
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Randomize Questions</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={randomizeOptions}
                  onChange={(e) => setRandomizeOptions(e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">Randomize Options</span>
              </label>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Questions</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddQuestion}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>

            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Question {qIndex + 1}</Label>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div>
                  <Label>Question Text</Label>
                  <Input
                    value={question.stem}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, 'stem', e.target.value)
                    }
                    placeholder="Enter question text"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>Difficulty (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={question.difficulty}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'difficulty', parseInt(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      min="1"
                      value={question.points}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'points', parseInt(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Type</Label>
                    <select
                      value={question.type}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, 'type', e.target.value)
                      }
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="MultipleChoice">Multiple Choice</option>
                      <option value="TrueFalse">True/False</option>
                      <option value="ShortAnswer">Short Answer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Explanation (optional)</Label>
                  <Input
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, 'explanation', e.target.value)
                    }
                    placeholder="Enter explanation"
                    className="mt-1"
                  />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Answer Options</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddOption(qIndex)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(qIndex, oIndex, 'text', e.target.value)
                        }
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleOptionChange(qIndex, oIndex, 'isCorrect', !option.isCorrect)
                        }
                        className={`p-2 rounded ${
                          option.isCorrect
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                        title={option.isCorrect ? 'Correct answer' : 'Mark as correct'}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      {question.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveOption(qIndex, oIndex)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
