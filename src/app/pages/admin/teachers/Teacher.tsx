'use client'

import { TeacherEditDialog } from '@/components/admin/teachers/teacher-edit-dialog'
import { UserEditDialog } from '@/components/admin/users/user-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import { deleteAccount } from '@/services/userService'
import { User } from '@/types/api'
import { Eye, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

function TeachersPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [userEditOpen, setUserEditOpen] = useState(false)
  const [teachers, setTeachers] = useState<User[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch teachers from API
  useEffect(() => {
    fetchTeachers()
  }, [currentPage]) // Refetch when page changes

  // Filter teachers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeachers(teachers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = teachers.filter(
        (teacher) =>
          teacher.userName.toLowerCase().includes(query) ||
          teacher.email.toLowerCase().includes(query) ||
          teacher.fullName?.toLowerCase().includes(query) ||
          teacher.id.toString().includes(query)
      )
      setFilteredTeachers(filtered)
    }
  }, [searchQuery, teachers])

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Dynamic import
      const { getTeachers } = await import('@/services/userService')
      const response = await getTeachers(currentPage, pageSize)
      setTeachers(response.data)
      setFilteredTeachers(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch teachers')
      console.error('Error fetching teachers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteAccount(id)
        fetchTeachers()
      } catch (err: any) {
        alert(err.message || 'Failed to delete teacher')
      }
    }
  }

  const handleEdit = (teacher: User) => {
    setEditingTeacher(teacher)
    setUserEditOpen(true)
  }

  const handleViewDetail = (teacher: User) => {
    setEditingTeacher(teacher)
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
          <div className="container mx-auto max-w-full px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Teacher Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage teacher accounts and assignments
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                {/* <Plus className="mr-2 h-4 w-4" /> */}
                Add Teacher
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
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>All Teachers</CardTitle>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {filteredTeachers.length} Total
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4">Loading teachers...</p>
                  </div>
                ) : filteredTeachers.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-4">
                      {searchQuery
                        ? 'No teachers found matching your search.'
                        : 'No teachers found. Add your first teacher!'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30 text-left">
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Teacher ID
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            User Name
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Full Name
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Email
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
                        {filteredTeachers.map((teacher) => (
                          <tr
                            key={teacher.id}
                            className="border-b transition-colors hover:bg-muted/50 last:border-0"
                          >
                            <td className="px-6 py-4 text-sm font-medium">
                              {teacher.id}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {/* <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={`/.jpg?height=40&width=40&query=${teacher.userName}`}
                                  />
                                  <AvatarFallback>
                                    {teacher.userName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar> */}
                                <span className="font-semibold text-foreground">
                                  {teacher.userName}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              {teacher.fullName || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {teacher.email}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-block h-2 w-2 rounded-full ${
                                    teacher.status === 'Active'
                                      ? 'bg-green-600'
                                      : 'bg-gray-600'
                                  }`}
                                />
                                <span className="text-sm font-medium">{teacher.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600"
                                  onClick={() => handleViewDetail(teacher)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEdit(teacher)}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDelete(teacher.id)}
                                  title="Delete"
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
            {!isLoading && filteredTeachers.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount}</span> teachers
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

      {editingTeacher && (
        <>
          <TeacherEditDialog
            teacher={{
              id: editingTeacher.id.toString(),
              name: editingTeacher.fullName || editingTeacher.userName,
              email: editingTeacher.email,
              status: editingTeacher.status === 'Active' ? 'Online' : 'Offline',
              courses: [],
              classes: [],
            }}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          <UserEditDialog
            user={editingTeacher}
            open={userEditOpen}
            onOpenChange={setUserEditOpen}
            onUpdate={fetchTeachers}
          />
        </>
      )}
    </div>
  )
}

// Wrap with SearchProvider
export default function TeachersPage() {
  return (
    <SearchProvider>
      <TeachersPageContent />
    </SearchProvider>
  )
}
