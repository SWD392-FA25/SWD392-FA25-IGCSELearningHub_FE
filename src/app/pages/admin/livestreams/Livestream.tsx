'use client'

import { LivestreamCreateDialog } from '@/components/admin/livestreams/livestream-create-dialog'
import { LivestreamEditDialog } from '@/components/admin/livestreams/livestream-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import {
  Livestream,
  deleteLivestream,
  getLivestreams,
} from '@/services/livestreamService'
import { getCourseById } from '@/services/courseService'
import { getUserById } from '@/services/userService'
import {
  Calendar,
  DollarSign,
  Eye,
  Pencil,
  Plus,
  Trash2,
  Users,
  Video,
} from 'lucide-react'
import { useEffect, useState } from 'react'

function LivestreamsPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedLivestream, setSelectedLivestream] =
    useState<Livestream | null>(null)
  const [livestreams, setLivestreams] = useState<Livestream[]>([])
  const [filteredLivestreams, setFilteredLivestreams] = useState<Livestream[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [courseMap, setCourseMap] = useState<Map<number, string>>(new Map())
  const [teacherMap, setTeacherMap] = useState<Map<number, string>>(new Map())

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch livestreams from API
  useEffect(() => {
    fetchLivestreams()
  }, [currentPage]) // Refetch when page changes

  // Filter livestreams based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLivestreams(livestreams)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = livestreams.filter(
        (livestream) =>
          livestream.title.toLowerCase().includes(query) ||
          livestream.id.toString().includes(query) ||
          livestream.courseId.toString().includes(query) ||
          livestream.teacherId.toString().includes(query)
      )
      setFilteredLivestreams(filtered)
    }
  }, [searchQuery, livestreams])

  const fetchLivestreams = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getLivestreams(currentPage, pageSize)
      setLivestreams(response.data)
      setFilteredLivestreams(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)

      // Fetch course titles and teacher names
      const uniqueCourseIds = [...new Set(response.data.map(ls => ls.courseId))]
      const uniqueTeacherIds = [...new Set(response.data.map(ls => ls.teacherId))]
      
      const newCourseMap = new Map<number, string>()
      const newTeacherMap = new Map<number, string>()
      
      await Promise.all([
        ...uniqueCourseIds.map(async (courseId) => {
          try {
            const course = await getCourseById(courseId)
            console.log(`Course ${courseId}:`, course)
            newCourseMap.set(courseId, course.title)
          } catch (error) {
            console.error(`Failed to fetch course ${courseId}:`, error)
            newCourseMap.set(courseId, `Course ${courseId}`)
          }
        }),
        ...uniqueTeacherIds.map(async (teacherId) => {
          try {
            const teacher = await getUserById(teacherId)
            console.log(`Teacher ${teacherId}:`, teacher)
            newTeacherMap.set(teacherId, teacher.fullName || teacher.userName)
          } catch (error) {
            console.error(`Failed to fetch teacher ${teacherId}:`, error)
            newTeacherMap.set(teacherId, `Teacher ${teacherId}`)
          }
        })
      ])
      
      console.log('Course map:', newCourseMap)
      console.log('Teacher map:', newTeacherMap)
      setCourseMap(newCourseMap)
      setTeacherMap(newTeacherMap)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch livestreams')
      console.error('Error fetching livestreams:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (livestream: Livestream) => {
    setSelectedLivestream(livestream)
    setEditOpen(true)
  }

  const handleEditSuccess = () => {
    setSuccessMessage('Livestream updated successfully!')
    fetchLivestreams()
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleDelete = async (id: number) => {
    // Find livestream title for better confirmation message
    const livestream = livestreams.find((ls) => ls.id === id)
    const confirmMessage = livestream
      ? `Are you sure you want to delete "${livestream.title}"?\n\nThis action cannot be undone.`
      : 'Are you sure you want to delete this livestream?\n\nThis action cannot be undone.'

    if (confirm(confirmMessage)) {
      try {
        setDeletingId(id)
        setError(null)
        setSuccessMessage(null)

        await deleteLivestream(id)

        // Show success message
        setSuccessMessage(
          `Livestream "${livestream?.title || id}" deleted successfully!`
        )

        // Refresh the list
        await fetchLivestreams()

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } catch (err: any) {
        setError(err.message || 'Failed to delete livestream')
        console.error('Error deleting livestream:', err)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <LivestreamCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={fetchLivestreams}
      />

      <LivestreamEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
        livestream={selectedLivestream}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto max-w-full px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Livestream Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage livestream sessions and schedules
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                {/* <Plus className="mr-2 h-4 w-4" /> */}
                Add Livestream
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-700 border border-green-200">
                ✓ {successMessage}
              </div>
            )}

            <Card className="shadow-sm">
              <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    <CardTitle>All Livestreams</CardTitle>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {filteredLivestreams.length} Total
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4">Loading livestreams...</p>
                  </div>
                ) : filteredLivestreams.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Video className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-4">
                      {searchQuery
                        ? 'No livestreams found matching your search.'
                        : 'No livestreams found. Create your first livestream!'}
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
                            Course Name
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Teacher Name
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Schedule
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Price
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Registrations
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLivestreams.map((livestream) => (
                          <tr
                            key={livestream.id}
                            className="border-b transition-colors hover:bg-muted/50 last:border-0"
                          >
                            <td className="px-6 py-4 text-sm font-medium">
                              {livestream.id}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-foreground">
                                {livestream.title}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="font-medium">
                                {courseMap.get(livestream.courseId) || `Course ${livestream.courseId}`}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="font-medium">
                                {teacherMap.get(livestream.teacherId) || `Teacher ${livestream.teacherId}`}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(livestream.schedule)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                                {/* <DollarSign className="h-4 w-4" /> */}
                                {formatPrice(livestream.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-medium">{livestream.registrationCount}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEdit(livestream)}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDelete(livestream.id)}
                                  disabled={deletingId === livestream.id}
                                  title="Delete"
                                >
                                  {deletingId === livestream.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive border-t-transparent" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
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

            {/* Pagination */}
            {!isLoading && filteredLivestreams.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount}</span> livestreams
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="h-9"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const maxVisible = 5
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
                      const endPage = Math.min(totalPages, startPage + maxVisible - 1)
                      
                      if (endPage - startPage + 1 < maxVisible) {
                        startPage = Math.max(1, endPage - maxVisible + 1)
                      }
                      
                      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-9 min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      ))
                    })()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-9"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Wrap with SearchProvider
export default function LivestreamsPage() {
  return (
    <SearchProvider>
      <LivestreamsPageContent />
    </SearchProvider>
  )
}
