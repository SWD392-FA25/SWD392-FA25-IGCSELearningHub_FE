'use client'

import { LivestreamCreateDialog } from '@/components/admin/livestreams/livestream-create-dialog'
import { LivestreamEditDialog } from '@/components/admin/livestreams/livestream-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import {
  Livestream,
  deleteLivestream,
  getLivestreams,
} from '@/services/livestreamService'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Livestream Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage livestream sessions and schedules
                </p>
              </div>
              <Button
                className="bg-primary"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
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

            <Card>
              <CardHeader>
                <CardTitle>
                  All Livestreams ({filteredLivestreams.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading livestreams...
                  </div>
                ) : filteredLivestreams.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchQuery
                      ? 'No livestreams found matching your search.'
                      : 'No livestreams found.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-3 font-medium text-muted-foreground">
                            ID
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Title
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Course ID
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Teacher ID
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Schedule
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Registrations
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredLivestreams.map((livestream) => (
                          <tr
                            key={livestream.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-4 text-sm font-medium">
                              {livestream.id}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                                  <Video className="h-5 w-5 text-red-600" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {livestream.title}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-sm">
                              <Badge variant="outline" className="gap-1">
                                Course {livestream.courseId}
                              </Badge>
                            </td>
                            <td className="py-4 text-sm">
                              <Badge variant="outline" className="gap-1">
                                Teacher {livestream.teacherId}
                              </Badge>
                            </td>
                            <td className="py-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(livestream.schedule)}
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                <DollarSign className="h-4 w-4" />
                                {formatPrice(livestream.price)}
                              </div>
                            </td>
                            <td className="py-4">
                              <Badge
                                variant="secondary"
                                className={
                                  livestream.registrationCount > 0
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                }
                              >
                                <Users className="mr-1 h-3 w-3" />
                                {livestream.registrationCount}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(livestream)}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
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
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
                  livestreams
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
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
