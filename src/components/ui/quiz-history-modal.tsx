import React, { useState, useEffect } from 'react'
import { Modal, Table, Tag, Button, Spin, Alert, message, Pagination } from 'antd'
import { 
  HistoryOutlined,
  EyeOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { quizService } from '@/services/quiz-service'
import { QuizAttempt, QuizAttemptResult } from '@/types/api-types'
import { formatDate } from '@/lib/formatDate'

interface QuizHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export const QuizHistoryModal: React.FC<QuizHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const [selectedAttemptResult, setSelectedAttemptResult] = useState<QuizAttemptResult | null>(null)
  const [resultModalVisible, setResultModalVisible] = useState(false)
  const [resultLoading, setResultLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchQuizAttempts()
    }
  }, [isOpen, currentPage])

  const fetchQuizAttempts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await quizService.getQuizAttempts(currentPage, pageSize)
      if (response.succeeded && response.data) {
        setAttempts(response.data)
        setTotalCount(response.totalCount)
        setTotalPages(response.totalPages)
      } else {
        throw new Error(response.message || 'Failed to fetch quiz attempts')
      }
    } catch (err) {
      console.error('Error fetching quiz attempts:', err)
      setError('Failed to load quiz attempts. Please try again.')
      setAttempts([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewResult = async (quizId: number, attemptId: number) => {
    setResultLoading(true)
    try {
      const response = await quizService.getQuizAttemptResult(quizId, attemptId)
      if (response.succeeded && response.data) {
        setSelectedAttemptResult(response.data)
        setResultModalVisible(true)
      } else {
        throw new Error(response.message || 'Failed to fetch attempt result')
      }
    } catch (err) {
      console.error('Error fetching attempt result:', err)
      message.error('Failed to load attempt result')
    } finally {
      setResultLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green'
      case 'in_progress': return 'blue'
      case 'not_started': return 'orange'
      case 'submitted': return 'green'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: 'Attempt ID',
      dataIndex: 'attemptId',
      key: 'attemptId',
      width: 100,
    },
    {
      title: 'Quiz ID',
      dataIndex: 'quizId',
      key: 'quizId',
      width: 100,
    },
    {
      title: 'Started At',
      dataIndex: 'startedAt',
      key: 'startedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => date ? formatDate(date) : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status.replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score !== undefined ? `${score}%` : '-',
    },
    {
      title: 'Questions',
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
    },
    {
      title: 'Correct',
      dataIndex: 'correctAnswers',
      key: 'correctAnswers',
      render: (correct: number) => correct !== undefined ? correct : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: QuizAttempt) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewResult(record.quizId, record.attemptId)}
          loading={resultLoading}
          disabled={!record.submittedAt}
        >
          View Result
        </Button>
      ),
    },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <Modal
        title="Quiz Attempt History"
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ]}
        width={1200}
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
                <Button size="small" onClick={fetchQuizAttempts}>
                  Retry
                </Button>
              }
            />
          )}

          {!loading && !error && attempts.length === 0 && (
            <div className="text-center py-12">
              <HistoryOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Quiz Attempts Yet
              </h3>
              <p className="text-gray-500 mb-6">
                You haven't taken any quizzes yet. Start taking quizzes to see your history here.
              </p>
            </div>
          )}

          {attempts.length > 0 && (
            <>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground">
                  Showing {attempts.length} of {totalCount} attempts
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={attempts}
                rowKey="attemptId"
                pagination={false}
                size="small"
              />

              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalCount}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} attempts`
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
        title={`Quiz Result - ${selectedAttemptResult?.title || 'Loading...'}`}
        open={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false)
          setSelectedAttemptResult(null)
        }}
        footer={[
          <Button key="close" onClick={() => {
            setResultModalVisible(false)
            setSelectedAttemptResult(null)
          }}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedAttemptResult && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedAttemptResult.score}%
                  </div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedAttemptResult.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {selectedAttemptResult.totalQuestions}
                  </div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedAttemptResult.totalQuestions - selectedAttemptResult.correctAnswers}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Attempt Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Attempt ID:</span>
                  <span className="ml-2 font-medium">{selectedAttemptResult.attemptId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quiz ID:</span>
                  <span className="ml-2 font-medium">{selectedAttemptResult.quizId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="ml-2 font-medium">{formatDate(selectedAttemptResult.submittedAt)}</span>
                </div>
              </div>
            </div>

            {selectedAttemptResult.answers && selectedAttemptResult.answers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Answer Review</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedAttemptResult.answers.map((answer, index) => (
                    <div 
                      key={answer.questionId}
                      className={`p-4 rounded-lg border ${
                        answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium">Question {index + 1}</span>
                        {answer.isCorrect ? (
                          <CheckCircleOutlined className="text-green-500" />
                        ) : (
                          <ClockCircleOutlined className="text-red-500" />
                        )}
                      </div>
                      <div className="text-sm mb-2">{answer.questionText}</div>
                      <div className="text-xs text-muted-foreground">
                        Selected: {answer.selectedOptionIds.join(', ')} | 
                        Correct: {answer.correctOptionIds.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}