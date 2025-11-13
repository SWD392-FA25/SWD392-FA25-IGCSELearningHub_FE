'use client'

import { PackageCreateDialog } from '@/components/admin/packages/package-create-dialog'
import { PackageEditDialog } from '@/components/admin/packages/package-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchProvider, useSearch } from '@/context/SearchContext'
import { Package, deletePackage, getPackages } from '@/services/packageService'
import {
  BookOpen,
  Calendar,
  DollarSign,
  Eye,
  Package as PackageIcon,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { useEffect, useState } from 'react'

function PackagesPageContent() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768
    }
    return true
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
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

  // Fetch packages from API
  useEffect(() => {
    fetchPackages()
  }, [currentPage]) // Refetch when page changes

  // Filter packages based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPackages(packages)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(query) ||
          pkg.id.toString().includes(query)
      )
      setFilteredPackages(filtered)
    }
  }, [searchQuery, packages])

  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getPackages(currentPage, pageSize)
      setPackages(response.data)
      setFilteredPackages(response.data)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch packages')
      console.error('Error fetching packages:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg)
    setEditOpen(true)
  }

  const handleEditSuccess = () => {
    setSuccessMessage('Package updated successfully!')
    fetchPackages()
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleDelete = async (id: number) => {
    // Find package name for better confirmation message
    const pkg = packages.find((p) => p.id === id)
    const confirmMessage = pkg
      ? `Are you sure you want to delete "${pkg.name}"?\n\nThis action cannot be undone.`
      : 'Are you sure you want to delete this package?\n\nThis action cannot be undone.'

    if (confirm(confirmMessage)) {
      try {
        setDeletingId(id)
        setError(null)
        setSuccessMessage(null)

        await deletePackage(id)

        // Show success message
        setSuccessMessage(`Package "${pkg?.name || id}" deleted successfully!`)

        // Refresh the list
        await fetchPackages()

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } catch (err: any) {
        setError(err.message || 'Failed to delete package')
        console.error('Error deleting package:', err)
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

      <PackageCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => {
          setSuccessMessage('Package created successfully!')
          fetchPackages()
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
        }}
      />

      <PackageEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={() => {
          setSuccessMessage('Package updated successfully!')
          fetchPackages()
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
        }}
        package={selectedPackage}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto max-w-full px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Package Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage course packages and bundles
                </p>
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => setCreateOpen(true)}
              >
                {/* <Plus className="mr-2 h-4 w-4" /> */}
                Add Package
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
                    <PackageIcon className="h-5 w-5 text-primary" />
                    <CardTitle>All Packages</CardTitle>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {filteredPackages.length} Total
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4">Loading packages...</p>
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <PackageIcon className="mx-auto h-12 w-12 opacity-20" />
                    <p className="mt-4">
                      {searchQuery
                        ? 'No packages found matching your search.'
                        : 'No packages found. Create your first package!'}
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
                            Package Name
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Price
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Courses
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Created Date
                          </th>
                          <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPackages.map((pkg) => (
                          <tr
                            key={pkg.id}
                            className="border-b transition-colors hover:bg-muted/50 last:border-0"
                          >
                            <td className="px-6 py-4 text-sm font-medium">
                              {pkg.id}
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-foreground">
                                {pkg.name}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                                {/* <DollarSign className="h-4 w-4" /> */}
                                {formatPrice(pkg.price)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{pkg.courseCount} courses</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(pkg.createdAt)}</span>
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
                                  onClick={() => handleEdit(pkg)}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => handleDelete(pkg.id)}
                                  disabled={deletingId === pkg.id}
                                  title="Delete"
                                >
                                  {deletingId === pkg.id ? (
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
            {!isLoading && filteredPackages.length > 0 && (
              <div className="mt-6 flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
                  <span className="font-medium text-foreground">{totalCount}</span> packages
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
export default function PackagesPage() {
  return (
    <SearchProvider>
      <PackagesPageContent />
    </SearchProvider>
  )
}
