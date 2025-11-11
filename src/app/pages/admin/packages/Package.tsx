'use client'

import { PackageCreateDialog } from '@/components/admin/packages/package-create-dialog'
import { PackageEditDialog } from '@/components/admin/packages/package-edit-dialog'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Package Management</h1>
                <p className="mt-1 text-muted-foreground">
                  Manage course packages and bundles
                </p>
              </div>
              <Button
                className="bg-primary"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
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

            <Card>
              <CardHeader>
                <CardTitle>All Packages ({filteredPackages.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading packages...
                  </div>
                ) : filteredPackages.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchQuery
                      ? 'No packages found matching your search.'
                      : 'No packages found.'}
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
                            Package Name
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Price
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Courses
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Created Date
                          </th>
                          <th className="pb-3 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPackages.map((pkg) => (
                          <tr
                            key={pkg.id}
                            className="border-b border-border last:border-0"
                          >
                            <td className="py-4 text-sm font-medium">
                              {pkg.id}
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                                  <PackageIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {pkg.name}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                <DollarSign className="h-4 w-4" />
                                {formatPrice(pkg.price)}
                              </div>
                            </td>
                            <td className="py-4">
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                              >
                                <BookOpen className="mr-1 h-3 w-3" />
                                {pkg.courseCount} courses
                              </Badge>
                            </td>
                            <td className="py-4 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(pkg.createdAt)}
                              </div>
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
                                  onClick={() => handleEdit(pkg)}
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
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
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * pageSize + 1} to{' '}
                  {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{' '}
                  packages
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
export default function PackagesPage() {
  return (
    <SearchProvider>
      <PackagesPageContent />
    </SearchProvider>
  )
}
