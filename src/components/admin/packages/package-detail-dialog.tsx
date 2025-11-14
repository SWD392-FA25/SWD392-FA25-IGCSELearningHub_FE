'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getPackageById, Package } from '@/services/packageService'
import { Calendar, DollarSign, BookOpen, Package as PackageIcon, List } from 'lucide-react'

interface PackageDetailDialogProps {
  packageId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PackageDetailDialog({
  packageId,
  open,
  onOpenChange,
}: PackageDetailDialogProps) {
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPackageDetail = useCallback(async () => {
    if (!packageId) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await getPackageById(packageId)
      console.log('Package detail response:', response)
      // Handle both direct response and wrapped response
      const data = (response as any).data || response
      setPackageData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch package details'
      setError(errorMessage)
      console.error('Error fetching package detail:', err)
    } finally {
      setIsLoading(false)
    }
  }, [packageId])

  useEffect(() => {
    if (open && packageId) {
      fetchPackageDetail()
    }
  }, [open, packageId, fetchPackageDetail])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Package Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading package details...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        ) : packageData ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                <PackageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{packageData.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Package ID: {packageData.id}</p>
                {packageData.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {packageData.description}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400 break-words">
                      {packageData.price != null ? formatPrice(packageData.price) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Courses</p>
                    <p className="text-lg font-bold">
                      {packageData.courses 
                        ? packageData.courses.length
                        : packageData.courseCount ?? 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-sm font-semibold break-words">
                      {packageData.createdAt ? formatDate(packageData.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses List */}
            {packageData.courses && packageData.courses.length > 0 && (
              <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <List className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Included Courses
                </h4>
                <div className="space-y-2">
                  {packageData.courses.map((course: any, index: number) => (
                    <div 
                      key={course.courseId || index}
                      className="flex items-center gap-3 rounded-lg bg-white dark:bg-gray-900 p-3 border border-blue-100 dark:border-blue-900/30"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {course.title || `Course ${course.courseId}`}
                        </p>
                        {course.level && (
                          <p className="text-xs text-muted-foreground">
                            Level: {course.level}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary Section */}
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Package Summary
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Courses:</span>
                  <span className="font-semibold">
                    {packageData.courses 
                      ? packageData.courses.length
                      : packageData.courseCount ?? 0} courses
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package Price:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {packageData.price != null ? formatPrice(packageData.price) : 'N/A'}
                  </span>
                </div>
                {packageData.courses && packageData.courses.length > 0 && (
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-semibold text-primary">Active Package</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
