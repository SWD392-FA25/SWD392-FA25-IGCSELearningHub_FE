'use client'

import React, { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Pagination, Alert, Spin, Modal, Descriptions, Progress, Switch, Row, Col } from 'antd'
import { BookOutlined, CalendarOutlined, PercentageOutlined, EyeOutlined, AppstoreOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { enrollmentService } from '@/services/enrollment-service'
import { Enrollment, EnrollmentDetail, PaginatedApiResponse } from '@/types/api-types'
import { formatDate } from '@/lib/formatDate'
import { EnrollmentCard } from '@/components/ui/enrollment-card'
import { MyCourseModal } from '@/components/ui/my-course-modal'

const MyLearningPage = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentDetail | null>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [courseModalVisible, setCourseModalVisible] = useState(false)
  
  const [isGridView, setIsGridView] = useState(true)

  useEffect(() => {
    fetchEnrollments(currentPage, pageSize)
  }, [currentPage, pageSize])

  const fetchEnrollments = async (page: number, size: number) => {
    setLoading(true)
    setError('')
    try {
      const response = await enrollmentService.getMyEnrollments(page, size)
      if (response.succeeded && response.data) {
        setEnrollments(response.data)
        setTotalCount(response.totalCount)
        setTotalPages(response.totalPages)
      } else {
        throw new Error(response.message || 'Failed to fetch enrollments')
      }
    } catch (err) {
      console.error('Error fetching enrollments:', err)
      setError('Failed to load your learning progress. Please try again.')
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (enrollmentId: number) => {
    setDetailLoading(true)
    try {
      const response = await enrollmentService.getEnrollmentById(enrollmentId)
      if (response.succeeded && response.data) {
        setSelectedEnrollment(response.data)
        setDetailModalVisible(true)
      } else {
        throw new Error(response.message || 'Failed to fetch enrollment details')
      }
    } catch (err) {
      console.error('Error fetching enrollment details:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const handleViewCourse = (courseId: number) => {
    setSelectedCourseId(courseId)
    setCourseModalVisible(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green'
      case 'completed': return 'blue'
      case 'cancelled': return 'red'
      case 'suspended': return 'orange'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: 'Course',
      dataIndex: 'courseTitle',
      key: 'courseTitle',
      render: (title: string, record: Enrollment) => (
        <div>
          <div className="font-medium text-foreground">{title}</div>
          <div className="text-sm text-muted-foreground">Course ID: {record.courseId}</div>
        </div>
      ),
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date: string) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-muted-foreground" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'completedPercent',
      key: 'completedPercent',
      render: (percent: number | null) => (
        <div className="flex items-center">
          <PercentageOutlined className="mr-2 text-muted-foreground" />
          {percent !== null ? (
            <Progress 
              percent={percent} 
              size="small" 
              status={percent === 100 ? 'success' : 'active'}
              className="min-w-[100px]"
            />
          ) : (
            <span className="text-muted-foreground">Not started</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Enrollment) => (
        <div className="space-x-2">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record.enrollmentId)}
            loading={detailLoading}
          >
            View Details
          </Button>
          <Button
            type="default"
            size="small"
            icon={<BookOutlined />}
            onClick={() => handleViewCourse(record.courseId)}
          >
            View Course
          </Button>
        </div>
      ),
    },
  ]

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page)
    if (size && size !== pageSize) {
      setPageSize(size)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Learning</h1>
            <p className="text-muted-foreground">Track your course progress and continue learning</p>
          </div>

          <Card>
        <Spin spinning={loading}>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mb-4"
              action={
                <Button size="small" onClick={() => fetchEnrollments(currentPage, pageSize)}>
                  Retry
                </Button>
              }
            />
          )}

          {!loading && !error && enrollments.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <BookOutlined className="text-4xl text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Chưa mua khóa học nào cả
                </h3>
                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                  Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học IGCSE chất lượng cao của chúng tôi!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button type="primary" size="large" href="/courses" className="min-w-[160px]">
                  🎓 Browse Courses
                </Button>
                <Button size="large" href="/about" className="min-w-[160px]">
                  📚 Learn More
                </Button>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Teachers</h4>
                  <p className="text-sm text-gray-600">Learn from qualified IGCSE instructors</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📱</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive Learning</h4>
                  <p className="text-sm text-gray-600">Engaging lessons with quizzes and assignments</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">🏆</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Track Progress</h4>
                  <p className="text-sm text-gray-600">Monitor your learning journey and achievements</p>
                </div>
              </div>
            </div>
          )}

          {enrollments.length > 0 && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {enrollments.length} of {totalCount} enrollments
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <UnorderedListOutlined className={!isGridView ? 'text-primary' : 'text-muted-foreground'} />
                    <Switch
                      checked={isGridView}
                      onChange={setIsGridView}
                      size="small"
                    />
                    <AppstoreOutlined className={isGridView ? 'text-primary' : 'text-muted-foreground'} />
                    <span className="text-sm text-muted-foreground ml-2">
                      {isGridView ? 'Grid View' : 'List View'}
                    </span>
                  </div>
                </div>
              </div>

              {isGridView ? (
                <div className="mb-6">
                  <Row gutter={[16, 16]}>
                    {enrollments.map((enrollment) => (
                      <Col key={enrollment.enrollmentId} xs={24} sm={12} lg={8} xl={6}>
                        <EnrollmentCard
                          enrollment={enrollment}
                          onViewDetails={handleViewDetails}
                          onViewCourse={handleViewCourse}
                          loading={detailLoading}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              ) : (
                /* Table View */
                <Table
                  columns={columns}
                  dataSource={enrollments}
                  rowKey="enrollmentId"
                  pagination={false}
                  className="mb-6"
                />
              )}

              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalCount}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} of ${total} enrollments`
                    }
                    onChange={handlePageChange}
                    pageSizeOptions={['10', '20', '50']}
                  />
                </div>
              )}
            </>
          )}
        </Spin>
      </Card>

      <Modal
        title={`Enrollment Details - ${selectedEnrollment?.courseTitle}`}
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false)
          setSelectedEnrollment(null)
        }}
        footer={[
          <Button key="close" onClick={() => {
            setDetailModalVisible(false)
            setSelectedEnrollment(null)
          }}>
            Close
          </Button>,
          selectedEnrollment && (
            <Button 
              key="course" 
              type="primary" 
              href={`/courses/${selectedEnrollment.courseId}`}
            >
              Go to Course
            </Button>
          )
        ]}
        width={800}
      >
        {selectedEnrollment && (
          <div className="space-y-6">
            <Card title="Course Information" size="small">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="Course Title">
                  {selectedEnrollment.courseTitle}
                </Descriptions.Item>
                <Descriptions.Item label="Course Level">
                  <Tag color="blue">{selectedEnrollment.courseLevel}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Enrollment ID">
                  {selectedEnrollment.enrollmentId}
                </Descriptions.Item>
                <Descriptions.Item label="Course ID">
                  {selectedEnrollment.courseId}
                </Descriptions.Item>
                <Descriptions.Item label="Enrollment Date">
                  {formatDate(selectedEnrollment.enrollmentDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedEnrollment.status)}>
                    {selectedEnrollment.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Progress">
                  {selectedEnrollment.completedPercent !== null ? (
                    <Progress 
                      percent={selectedEnrollment.completedPercent} 
                      size="small"
                      status={selectedEnrollment.completedPercent === 100 ? 'success' : 'active'}
                    />
                  ) : (
                    <span className="text-gray-400">Not started</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Last Access">
                  {selectedEnrollment.lastAccessDate ? 
                    formatDate(selectedEnrollment.lastAccessDate) : 
                    'Never'
                  }
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Modal>

      <MyCourseModal
        courseId={selectedCourseId}
        isOpen={courseModalVisible}
        onClose={() => {
          setCourseModalVisible(false)
          setSelectedCourseId(null)
        }}
      />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MyLearningPage