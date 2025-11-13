import React, { useState, useEffect } from 'react'
import { Modal, Card, List, Button, Tag, Spin, Alert, Pagination } from 'antd'
import toast from 'react-hot-toast'
import { 
  QuestionCircleOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { quizService } from '@/services/quiz-service'
import { QuizSummary, QuizForTake, QuizAttempt } from '@/types/api-types'
import { formatDate } from '@/lib/formatDate'

interface QuizModalProps {
  courseId: number | null
  isOpen: boolean
  onClose: () => void
}

export const QuizModal: React.FC<QuizModalProps> = ({
  courseId,
  isOpen,
  onClose
}) => {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [selectedQuiz, setSelectedQuiz] = useState<QuizForTake | null>(null)
  const [quizDetailVisible, setQuizDetailVisible] = useState(false)
  const [quizDetailLoading, setQuizDetailLoading] = useState(false)

  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [creatingAttempt, setCreatingAttempt] = useState(false)

  useEffect(() => {
    if (isOpen && courseId) {
      fetchQuizzes()
    }
  }, [isOpen, courseId, currentPage])

  const fetchQuizzes = async () => {
    if (!courseId) return
    
    setLoading(true)
    setError('')
    try {
      const response = await quizService.getQuizzesByCourse(courseId, currentPage, pageSize)
      if (response.succeeded && response.data) {
        setQuizzes(response.data)
        setTotalCount(response.data.length)
        setTotalPages(Math.ceil(response.data.length / pageSize))
      } else {
        throw new Error(response.message || 'Failed to fetch quizzes')
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err)
      setError('Failed to load quizzes. Please try again.')
      setQuizzes([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewQuiz = async (quizId: number) => {
    setQuizDetailLoading(true)
    try {
      const response = await quizService.getQuizForTake(quizId)
      if (response.succeeded && response.data) {
        setSelectedQuiz(response.data)
        setQuizDetailVisible(true)
      } else {
        throw new Error(response.message || 'Failed to fetch quiz details')
      }
    } catch (err) {
      console.error('Error fetching quiz details:', err)
      toast.error('Failed to load quiz details')
    } finally {
      setQuizDetailLoading(false)
    }
  }

  const handleStartQuiz = async (quizId: number) => {
    setCreatingAttempt(true)
    try {
      const response = await quizService.createQuizAttempt(quizId)
      if (response.succeeded && response.data) {
        setAttemptId(response.data)
        toast.success(`Quiz attempt created!`)
      } else {
        throw new Error(response.message || 'Failed to create quiz attempt')
      }
    } catch (err) {
      console.error('Error creating quiz attempt:', err)
      toast.error('Failed to start quiz')
    } finally {
      setCreatingAttempt(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Modal
        title="Course Quizzes"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ]}
        width={800}
        style={{ maxHeight: '90vh' }}
      >
        <Spin spinning={loading}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
              action={
                <Button size="small" onClick={fetchQuizzes}>
                  Retry
                </Button>
              }
            />
          )}

          {!loading && !error && quizzes.length === 0 && (
            <div className="text-center py-12">
              <QuestionCircleOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Quizzes Available
              </h3>
              <p className="text-gray-500 mb-6">
                This course doesn't have any quizzes yet.
              </p>
            </div>
          )}

          {quizzes.length > 0 && (
            <>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">
                  Showing {quizzes.length} of {totalCount} quizzes
                </div>
              </div>

              <List
                dataSource={quizzes}
                renderItem={(quiz) => (
                  <List.Item
                    actions={[
                      <Button
                        key="view"
                        type="text"
                        size="small"
                        icon={<QuestionCircleOutlined />}
                        onClick={() => handleViewQuiz(quiz.id)}
                        loading={quizDetailLoading}
                      >
                        View Quiz
                      </Button>,
                      <Button
                        key="start"
                        type="primary"
                        size="small"
                        icon={<PlayCircleOutlined />}
                        onClick={() => handleStartQuiz(quiz.id)}
                        loading={creatingAttempt}
                      >
                        Start Quiz
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<QuestionCircleOutlined className="text-blue-500" />}
                      title={
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{quiz.title}</span>
                          <Tag color="blue">{quiz.totalQuestions} questions</Tag>
                        </div>
                      }
                      description={
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Quiz ID: {quiz.id}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ClockCircleOutlined className="mr-1" />
                            Created: {formatDate(quiz.createdAt)}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalCount}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} quizzes`
                    }
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </Spin>
      </Modal>

      <Modal
        title={`Quiz Details - ${selectedQuiz?.title || 'Loading...'}`}
        open={quizDetailVisible}
        onCancel={() => {
          setQuizDetailVisible(false)
          setSelectedQuiz(null)
        }}
        footer={[
          <Button key="close" onClick={() => {
            setQuizDetailVisible(false)
            setSelectedQuiz(null)
          }}>
            Close
          </Button>,
          selectedQuiz && (
            <Button
              key="start"
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartQuiz(selectedQuiz.quizId)}
              loading={creatingAttempt}
            >
              Start Quiz
            </Button>
          )
        ]}
        width={600}
      >
        {selectedQuiz && (
          <Card title="Quiz Information" size="small">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Quiz ID:</span>
                  <div className="font-medium">{selectedQuiz.quizId}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Questions:</span>
                  <div className="font-medium">{selectedQuiz.totalQuestions}</div>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Title:</span>
                <div className="font-medium">{selectedQuiz.title}</div>
              </div>

              {attemptId && (
                <Alert
                  message="Quiz Attempt Created"
                  description={`Your attempt ID is: ${attemptId}. You can now start taking the quiz.`}
                  type="success"
                  showIcon
                />
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quiz Structure</h4>
                <div className="text-sm text-muted-foreground">
                  {selectedQuiz.questions.length === 0 ? (
                    <p>Quiz questions will be available when you start the quiz.</p>
                  ) : (
                    <p>This quiz contains {selectedQuiz.questions.length} questions.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </>
  )
}