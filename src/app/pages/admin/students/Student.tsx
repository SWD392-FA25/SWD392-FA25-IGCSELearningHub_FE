'use client'

import { StudentDetailDialog } from '@/components/admin/students/student-detail-dialog'
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

function StudentsPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [students, setStudents] = useState<User[]>([])
  const [filteredStudents, setFilteredStudents] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10 // 10 items per page

  // Use search from header context
  const { searchQuery } = useSearch()

  // Fetch students from API
  useEffect(() => {
    fetchStudents()
  }, [currentPage]) // Refetch when page changes

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = students.filter(
        (student) =>
          student.userName.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.fullName?.toLowerCase().includes(query) ||
          student.id.toString().includes(query)
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, students])

  const fetchStudents = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Dynamic import to ensure client-side
      const { getStudents } = await import('@/services/userService')
      const response = await getStudents(currentPage, pageSize)
      setStudents(response.data)
      setFilteredStudents(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students')
      console.error('Error fetching students:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteAccount(id)
        // Refresh the list after deletion
        fetchStudents()
      } catch (err: any) {
        alert(err.message || 'Failed to delete student')
      }
    }
  }

  const handleViewDetail = (student: User) => {
    setSelectedStudent(student)
    setDetailOpen(true)
  }

  const handleEdit = (student: User) => {
    setSelectedStudent(student)
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
                <h1 className="text-3xl font-bold">Student Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage student accounts and enrollments
                </p>
              </div>
              <Button className="bg-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-4 text-destructive">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>All Students ({filteredStudents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading students...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchQuery
                      ? 'No students found matching your search.'
                      : 'No students found.'}
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
                        {filteredStudents.map((student) => (
                          <tr
                            key={student.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-4 text-sm font-medium">
                              {student.id}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={`/.jpg?height=40&width=40&query=${student.userName}`}
                                  />
                                  <AvatarFallback>
                                    {student.userName.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {student.userName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-sm">
                              {student.fullName || 'N/A'}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {student.email}
                            </td>
                            <td className="py-4">
                              <Badge
                                variant="secondary"
                                className={
                                  student.status === 'Active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                                }
                              >
                                <span
                                  className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                                    student.status === 'Active'
                                      ? 'bg-green-600'
                                      : 'bg-gray-600'
                                  }`}
                                />
                                {student.status}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewDetail(student)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEdit(student)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDelete(student.id)}
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
            {!isLoading && filteredStudents.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
                  students
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

      {selectedStudent && (
        <>
          <StudentDetailDialog
            student={{
              id: selectedStudent.id.toString(),
              name: selectedStudent.fullName || selectedStudent.userName,
              email: selectedStudent.email,
              status:
                selectedStudent.status === 'Active' ? 'Online' : 'Offline',
              courses: [],
            }}
            open={detailOpen}
            onOpenChange={setDetailOpen}
          />
          <UserEditDialog
            user={selectedStudent}
            open={editOpen}
            onOpenChange={setEditOpen}
            onUpdate={fetchStudents}
          />
        </>
      )}
    </div>
  )
}

// Wrap with SearchProvider
export default function StudentsPage() {
  return (
    <SearchProvider>
      <StudentsPageContent />
    </SearchProvider>
  )
}
