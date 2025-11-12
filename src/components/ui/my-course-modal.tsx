import React, { useState, useEffect } from 'react'
import { Modal, Descriptions, Card, List, Button, Tag, Progress, Spin, Alert, Collapse, message, Slider, InputNumber } from 'antd'
import { 
  BookOutlined, 
  PlayCircleOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlaySquareOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons'
import { myCourseService } from '@/services/my-course-service'
import { MyCourseDetail, Unit, CourseLesson, LessonDetail } from '@/types/api-types'
import { formatDate } from '@/lib/formatDate'

const { Panel } = Collapse

interface MyCourseModalProps {
  courseId: number | null
  isOpen: boolean
  onClose: () => void
}

export const MyCourseModal: React.FC<MyCourseModalProps> = ({
  courseId,
  isOpen,
  onClose
}) => {
  const [courseDetail, setCourseDetail] = useState<MyCourseDetail | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<LessonDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [lessonLoading, setLessonLoading] = useState(false)
  const [error, setError] = useState('')
  const [lessonModalVisible, setLessonModalVisible] = useState(false)
  const [completingLessons, setCompletingLessons] = useState<Set<number>>(new Set())
  const [courseProgress, setCourseProgress] = useState<number>(0)
  const [progressLoading, setProgressLoading] = useState(false)
  const [updatingProgress, setUpdatingProgress] = useState(false)

  useEffect(() => {
    if (isOpen && courseId) {
      fetchCourseDetail()
      fetchCourseProgress()
    }
  }, [isOpen, courseId])

  const fetchCourseDetail = async () => {
    if (!courseId) return
    
    setLoading(true)
    setError('')
    try {
      const response = await myCourseService.getMyCourseById(courseId)
      if (response.succeeded && response.data) {
        setCourseDetail(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch course details')
      }
    } catch (err) {
      console.error('Error fetching course details:', err)
      setError('Failed to load course details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourseProgress = async () => {
    if (!courseId) return
    
    setProgressLoading(true)
    try {
      const response = await myCourseService.getCourseProgress(courseId)
      if (response.succeeded && response.data) {
        setCourseProgress(response.data.completedPercent)
      }
    } catch (err) {
      console.error('Error fetching course progress:', err)
    } finally {
      setProgressLoading(false)
    }
  }

  const updateProgress = async (newProgress: number) => {
    if (!courseId) return
    
    setUpdatingProgress(true)
    try {
      const response = await myCourseService.updateCourseProgress(courseId, newProgress)
      if (response.succeeded) {
        setCourseProgress(newProgress)
        message.success('Progress updated successfully!')
      } else {
        throw new Error(response.message || 'Failed to update progress')
      }
    } catch (err) {
      console.error('Error updating progress:', err)
      message.error('Failed to update progress')
    } finally {
      setUpdatingProgress(false)
    }
  }

  const handleViewLesson = async (lessonId: number) => {
    if (!courseId) return
    
    setLessonLoading(true)
    try {
      const response = await myCourseService.getLessonById(courseId, lessonId)
      if (response.succeeded && response.data) {
        setSelectedLesson(response.data)
        setLessonModalVisible(true)
      } else {
        throw new Error(response.message || 'Failed to fetch lesson details')
      }
    } catch (err) {
      console.error('Error fetching lesson details:', err)
      message.error('Failed to load lesson details')
    } finally {
      setLessonLoading(false)
    }
  }

  const handleMarkComplete = async (lessonId: number) => {
    if (!courseId) return
    
    setCompletingLessons(prev => new Set(prev).add(lessonId))
    try {
      const response = await myCourseService.markLessonCompleted(courseId, lessonId)
      if (response.succeeded) {
        message.success('Lesson marked as completed!')
        
        if (courseDetail) {
          const updatedCourse = { ...courseDetail }
          updatedCourse.units?.forEach(unit => {
            unit.lessons.forEach(lesson => {
              if (lesson.id === lessonId) {
                lesson.completed = true
              }
            })
          })
          setCourseDetail(updatedCourse)
        }
        
        if (selectedLesson && selectedLesson.lessonId === lessonId) {
          setSelectedLesson({ ...selectedLesson, completed: true })
        }
      } else {
        throw new Error(response.message || 'Failed to mark lesson as completed')
      }
    } catch (err) {
      console.error('Error marking lesson as completed:', err)
      message.error('Failed to mark lesson as completed')
    } finally {
      setCompletingLessons(prev => {
        const newSet = new Set(prev)
        newSet.delete(lessonId)
        return newSet
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'green'
      case 'intermediate': return 'blue'
      case 'advanced': return 'orange'
      default: return 'default'
    }
  }

  const calculateProgress = () => {
    if (!courseDetail?.units) return 0
    
    let totalLessons = 0
    let completedLessons = 0
    
    courseDetail.units.forEach(unit => {
      totalLessons += unit.lessons.length
      completedLessons += unit.lessons.filter(lesson => lesson.completed).length
    })
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  return (
    <>
      <Modal
        title={`Course Details - ${courseDetail?.title || 'Loading...'}`}
        open={isOpen}
        onCancel={onClose}
        footer={[
          <Button key="close" onClick={onClose}>
            Close
          </Button>
        ]}
        width={1200}
        style={{ maxHeight: '90vh', top: 20 }}
      >
        <Spin spinning={loading}>
          {error ? (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              action={
                <Button size="small" onClick={fetchCourseDetail}>
                  Try Again
                </Button>
              }
            />
          ) : courseDetail ? (
            <div className="space-y-6">
              <Card title="Course Information" size="small">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Title">{courseDetail.title}</Descriptions.Item>
                      <Descriptions.Item label="Level">
                        <Tag color={getLevelColor(courseDetail.level)}>{courseDetail.level}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Price">
                        <strong style={{ color: '#1890ff' }}>{formatPrice(courseDetail.price)}</strong>
                      </Descriptions.Item>
                      <Descriptions.Item label="Subject Group">{courseDetail.subjectGroup}</Descriptions.Item>
                    </Descriptions>
                  </div>
                  
                  <div>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Total Quizzes">{courseDetail.totalQuizzes}</Descriptions.Item>
                      <Descriptions.Item label="Total Assignments">{courseDetail.totalAssignments}</Descriptions.Item>
                      <Descriptions.Item label="Total Livestreams">{courseDetail.totalLivestreams || 0}</Descriptions.Item>
                      <Descriptions.Item label="Auto Progress">
                        <Progress 
                          percent={calculateProgress()} 
                          size="small" 
                          status={calculateProgress() === 100 ? 'success' : 'active'}
                        />
                      </Descriptions.Item>
                      <Descriptions.Item label="Manual Progress">
                        <Spin spinning={progressLoading}>
                          <Progress 
                            percent={courseProgress} 
                            size="small" 
                            status={courseProgress === 100 ? 'success' : 'active'}
                          />
                        </Spin>
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                </div>
                
                {courseDetail.description && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{courseDetail.description}</p>
                  </div>
                )}
                
                {courseDetail.info && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Additional Information</h4>
                    <p className="text-sm text-muted-foreground">{courseDetail.info}</p>
                  </div>
                )}
              </Card>

              <Card title="Progress Management" size="small">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Update Manual Progress</label>
                    <div className="flex items-center space-x-4">
                      <Slider 
                        min={0} 
                        max={100} 
                        value={courseProgress}
                        onChange={(value) => setCourseProgress(value)}
                        style={{ flex: 1 }}
                        disabled={updatingProgress}
                      />
                      <InputNumber
                        min={0}
                        max={100}
                        value={courseProgress}
                        onChange={(value) => setCourseProgress(value || 0)}
                        formatter={value => `${value}%`}
                        parser={value => parseInt(value!.replace('%', ''), 10)}
                        style={{ width: 80 }}
                        disabled={updatingProgress}
                      />
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => updateProgress(courseProgress)}
                        loading={updatingProgress}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {courseDetail.units && courseDetail.units.length > 0 && (
                <Card title="Course Content" size="small">
                  <Collapse accordion>
                    {courseDetail.units.map((unit) => (
                      <Panel
                        key={unit.id}
                        header={
                          <div className="flex items-center justify-between w-full mr-4">
                            <div>
                              <strong>{unit.title}</strong>
                              {unit.description && (
                                <div className="text-sm text-muted-foreground">{unit.description}</div>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {unit.lessons.filter(l => l.completed).length}/{unit.lessons.length} completed
                            </div>
                          </div>
                        }
                      >
                        <List
                          dataSource={unit.lessons}
                          renderItem={(lesson) => (
                            <List.Item
                              actions={[
                                <Button
                                  key="view"
                                  type="text"
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() => handleViewLesson(lesson.id)}
                                  loading={lessonLoading}
                                >
                                  View
                                </Button>,
                                !lesson.completed && (
                                  <Button
                                    key="complete"
                                    type="text"
                                    size="small"
                                    icon={<CheckCircleOutlined />}
                                    onClick={() => handleMarkComplete(lesson.id)}
                                    loading={completingLessons.has(lesson.id)}
                                  >
                                    Mark Complete
                                  </Button>
                                )
                              ].filter(Boolean)}
                            >
                              <List.Item.Meta
                                avatar={
                                  <div className="flex items-center space-x-2">
                                    {lesson.completed ? (
                                      <CheckCircleOutlined className="text-green-500" />
                                    ) : (
                                      <ClockCircleOutlined className="text-gray-400" />
                                    )}
                                    {lesson.videoUrl && <PlaySquareOutlined className="text-blue-500" />}
                                    {lesson.attachmentUrl && <FileTextOutlined className="text-orange-500" />}
                                  </div>
                                }
                                title={
                                  <div className="flex items-center space-x-2">
                                    <span>{lesson.title}</span>
                                    {lesson.isFreePreview && (
                                      <Tag color="blue">Free Preview</Tag>
                                    )}
                                    {lesson.completed && (
                                      <Tag color="green">Completed</Tag>
                                    )}
                                  </div>
                                }
                                description={lesson.description}
                              />
                            </List.Item>
                          )}
                        />
                      </Panel>
                    ))}
                  </Collapse>
                </Card>
              )}
            </div>
          ) : null}
        </Spin>
      </Modal>

      <Modal
        title={`Lesson Details - ${selectedLesson?.title || 'Loading...'}`}
        open={lessonModalVisible}
        onCancel={() => {
          setLessonModalVisible(false)
          setSelectedLesson(null)
        }}
        footer={[
          <Button key="close" onClick={() => {
            setLessonModalVisible(false)
            setSelectedLesson(null)
          }}>
            Close
          </Button>,
          selectedLesson && !selectedLesson.completed && (
            <Button
              key="complete"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleMarkComplete(selectedLesson.lessonId)}
              loading={completingLessons.has(selectedLesson.lessonId)}
            >
              Mark as Completed
            </Button>
          )
        ]}
        width={800}
      >
        {selectedLesson && (
          <div className="space-y-6">
            <Card title="Lesson Information" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Lesson ID">{selectedLesson.lessonId}</Descriptions.Item>
                <Descriptions.Item label="Course ID">{selectedLesson.courseId}</Descriptions.Item>
                <Descriptions.Item label="Unit ID">{selectedLesson.unitId}</Descriptions.Item>
                <Descriptions.Item label="Order">{selectedLesson.orderIndex}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  {selectedLesson.completed ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>Completed</Tag>
                  ) : (
                    <Tag color="orange" icon={<ClockCircleOutlined />}>In Progress</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Free Preview">
                  {selectedLesson.isFreePreview ? (
                    <Tag color="blue">Yes</Tag>
                  ) : (
                    <Tag color="default">No</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
              
              {selectedLesson.description && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedLesson.description}</p>
                </div>
              )}
            </Card>

            <Card title="Lesson Resources" size="small">
              {selectedLesson.videoUrl ? (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <PlaySquareOutlined className="text-blue-500" />
                    <span className="font-medium">Video Lesson</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-muted-foreground mb-2">Video URL:</p>
                    <a 
                      href={selectedLesson.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {selectedLesson.videoUrl}
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mb-4 text-center py-4 text-muted-foreground">
                  <PlaySquareOutlined className="text-2xl mb-2" />
                  <div>No video available for this lesson</div>
                </div>
              )}

              {selectedLesson.attachmentUrl ? (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FileTextOutlined className="text-orange-500" />
                    <span className="font-medium">Attachment</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm text-muted-foreground mb-2">Attachment URL:</p>
                    <a 
                      href={selectedLesson.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all flex items-center space-x-1"
                    >
                      <DownloadOutlined />
                      <span>{selectedLesson.attachmentUrl}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <FileTextOutlined className="text-2xl mb-2" />
                  <div>No attachment available for this lesson</div>
                </div>
              )}
            </Card>
          </div>
        )}
      </Modal>
    </>
  )
}