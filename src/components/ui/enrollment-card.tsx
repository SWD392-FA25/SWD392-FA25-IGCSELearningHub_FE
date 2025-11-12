import React from 'react'
import { Card, Tag, Progress, Button } from 'antd'
import { BookOutlined, CalendarOutlined, PercentageOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Enrollment } from '@/types/api-types'
import { formatDate } from '@/lib/formatDate'

interface EnrollmentCardProps {
  enrollment: Enrollment
  onViewDetails: (enrollmentId: number) => void
  onViewCourse: (courseId: number) => void
  loading?: boolean
}

export const EnrollmentCard: React.FC<EnrollmentCardProps> = ({
  enrollment,
  onViewDetails,
  onViewCourse,
  loading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green'
      case 'completed': return 'blue'
      case 'cancelled': return 'red'
      case 'suspended': return 'orange'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return '🟢'
      case 'completed': return '✅'
      case 'cancelled': return '❌'
      case 'suspended': return '⏸️'
      default: return '⚪'
    }
  }

  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200"
      actions={[
        <Button
          key="details"
          type="text"
          icon={<EyeOutlined />}
          onClick={() => onViewDetails(enrollment.enrollmentId)}
          loading={loading}
          className="w-full"
        >
          View Details
        </Button>,
        <Button
          key="course"
          type="text"
          icon={<BookOutlined />}
          onClick={() => onViewCourse(enrollment.courseId)}
          className="w-full"
        >
          View Course
        </Button>
      ]}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {enrollment.courseTitle}
          </h3>
          <div className="text-sm text-muted-foreground">
            Course ID: {enrollment.courseId}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{getStatusIcon(enrollment.status)}</span>
            <Tag color={getStatusColor(enrollment.status)} className="capitalize">
              {enrollment.status}
            </Tag>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarOutlined className="mr-1" />
            {formatDate(enrollment.enrollmentDate)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <PercentageOutlined className="mr-1" />
              <span>Progress</span>
            </div>
            {enrollment.completedPercent !== null && (
              <span className="text-sm font-medium text-foreground">
                {enrollment.completedPercent}%
              </span>
            )}
          </div>
          
          {enrollment.completedPercent !== null ? (
            <Progress 
              percent={enrollment.completedPercent} 
              size="small"
              status={enrollment.completedPercent === 100 ? 'success' : 'active'}
              strokeColor={
                enrollment.completedPercent === 100 ? '#52c41a' :
                enrollment.completedPercent >= 50 ? '#1890ff' : '#faad14'
              }
            />
          ) : (
            <div className="flex items-center text-muted-foreground text-sm">
              <ClockCircleOutlined className="mr-1" />
              <span>Not started yet</span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
          Enrollment ID: {enrollment.enrollmentId}
        </div>
      </div>
    </Card>
  )
}