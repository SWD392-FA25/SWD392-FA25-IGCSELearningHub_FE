'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TeacherLivestreamCreateDialog } from '@/components/teacher/livestream-create-dialog'
import { LivestreamEditDialog } from '@/components/admin/livestreams/livestream-edit-dialog'
import {
  Livestream,
  deleteLivestream,
  getLivestreams,
} from '@/services/livestreamService'
import {
  Calendar,
  Clock,
  Pencil,
  Trash2,
  Video,
  ExternalLink,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface TeacherLivestreamManagementProps {
  courseId: number
}

export function TeacherLivestreamManagement({
  courseId,
}: TeacherLivestreamManagementProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingLivestream, setEditingLivestream] = useState<Livestream | null>(
    null
  )
  const [livestreams, setLivestreams] = useState<Livestream[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLivestreams()
  }, [courseId])

  const fetchLivestreams = async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Fetch all livestreams and filter by courseId
      const response = await getLivestreams(1, 100)
      const courseLivestreams = response.data.filter(
        (l) => l.courseId === courseId
      )
      setLivestreams(courseLivestreams)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to fetch livestreams')
      console.error('Error fetching livestreams:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this livestream?')) {
      try {
        await deleteLivestream(id)
        fetchLivestreams()
      } catch (err) {
        const error = err as Error
        alert(error.message || 'Failed to delete livestream')
      }
    }
  }

  const handleEdit = (livestream: Livestream) => {
    setEditingLivestream(livestream)
    setEditOpen(true)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (startTime: string, endTime: string) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (now < start) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50">
          <Clock className="h-3 w-3" />
          Upcoming
        </span>
      )
    } else if (now >= start && now <= end) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-green-600 bg-green-50">
          <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
          Live Now
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50">
          Ended
        </span>
      )
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Livestreams</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage livestream sessions for this course
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
          Create Livestream
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
              <Video className="h-5 w-5 text-primary" />
              <CardTitle>Course Livestreams</CardTitle>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {livestreams.length} Total
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4">Loading livestreams...</p>
            </div>
          ) : livestreams.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Video className="mx-auto h-12 w-12 opacity-20" />
              <p className="mt-4">
                No livestreams found. Create your first livestream!
              </p>
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
                      Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Start Time
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      End Time
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {livestreams.map((livestream) => (
                    <tr
                      key={livestream.id}
                      className="border-b transition-colors hover:bg-muted/50 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium">
                        {livestream.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {livestream.title}
                          </span>
                          {livestream.meetingUrl && (
                            <a
                              href={livestream.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 text-xs text-primary hover:underline inline-flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Join Meeting
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(livestream.startTime)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(livestream.endTime)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(livestream.startTime, livestream.endTime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleEdit(livestream)}
                            title="Edit livestream"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(livestream.id)}
                            title="Delete livestream"
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

      <TeacherLivestreamCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchLivestreams}
        courseId={courseId}
      />

      <LivestreamEditDialog
        livestream={editingLivestream}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={fetchLivestreams}
      />
    </>
  )
}
