'use client'

import { ParentDetailDialog } from '@/components/admin/parents/parent-detail-dialog'
import { UserEditDialog } from '@/components/admin/users/user-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import { deleteAccount } from '@/services/userService'
import { User } from '@/types/api'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

function ParentsPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })
  const [selectedParent, setSelectedParent] = useState<User | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [parents, setParents] = useState<User[]>([])
  const [filteredParents, setFilteredParents] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch parents from API
  useEffect(() => {
    fetchParents()
  }, [currentPage]) // Refetch when page changes

  // Filter parents based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredParents(parents)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = parents.filter(
        (parent) =>
          parent.userName.toLowerCase().includes(query) ||
          parent.email.toLowerCase().includes(query) ||
          parent.fullName?.toLowerCase().includes(query) ||
          parent.id.toString().includes(query)
      )
      setFilteredParents(filtered)
    }
  }, [searchQuery, parents])

  const fetchParents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Dynamic import
      const { getParents } = await import('@/services/userService')
      const response = await getParents(currentPage, pageSize)
      setParents(response.data)
      setFilteredParents(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch parents')
      console.error('Error fetching parents:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this parent account?')) {
      try {
        await deleteAccount(id)
        fetchParents()
      } catch (err: any) {
        alert(err.message || 'Failed to delete parent')
      }
    }
  }

  const handleViewDetail = (parent: User) => {
    setSelectedParent(parent)
    setDetailOpen(true)
  }

  const handleEdit = (parent: User) => {
    setSelectedParent(parent)
    setEditOpen(true)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Parent Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage parent accounts and relationships
                </p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Parent
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Parents ({filteredParents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading parents...
                  </div>
                ) : filteredParents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchQuery
                      ? 'No parents found matching your search.'
                      : 'No parents found.'}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="pb-3 font-medium text-muted-foreground">
                            User ID
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            User Name
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Full Name
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Email
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredParents.map((parent) => (
                          <tr
                            key={parent.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-4 text-sm font-medium">
                              {parent.id}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={`/.jpg?height=40&width=40&query=${parent.userName}`}
                                  />
                                  <AvatarFallback>
                                    {parent.userName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {parent.userName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-sm">
                              {parent.fullName || 'N/A'}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {parent.email}
                            </td>
                            <td className="py-4">
                              <Badge
                                variant="secondary"
                                className={
                                  parent.status === 'Active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                }
                              >
                                <span
                                  className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                                    parent.status === 'Active'
                                      ? 'bg-green-600'
                                      : 'bg-gray-600'
                                  }`}
                                />
                                {parent.status}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewDetail(parent)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(parent)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDelete(parent.id)}
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

            {/* Pagination */}
            {!isLoading && filteredParents.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
                  parents
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

      {selectedParent && (
        <>
          <ParentDetailDialog
            parent={{
              id: selectedParent.id.toString(),
              name: selectedParent.fullName || selectedParent.userName,
              email: selectedParent.email,
              status: selectedParent.status === 'Active' ? 'Online' : 'Offline',
              children: [],
            }}
            open={detailOpen}
            onOpenChange={setDetailOpen}
          />
          <UserEditDialog
            user={selectedParent}
            open={editOpen}
            onOpenChange={setEditOpen}
            onUpdate={fetchParents}
          />
        </>
      )}
    </div>
  )
}

// Wrap with SearchProvider
export default function ParentsPage() {
  return (
    <SearchProvider>
      <ParentsPageContent />
    </SearchProvider>
  )
}
