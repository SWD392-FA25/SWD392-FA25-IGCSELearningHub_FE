'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getPackageById, Package } from '@/services/packageService'
import { Calendar, DollarSign, BookOpen } from 'lucide-react'

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
      setPackageData(response)
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Package Details</DialogTitle>
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
            <div>
              <h3 className="text-2xl font-bold">{packageData.name}</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg border p-4">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-semibold">{formatPrice(packageData.price)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border p-4">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="font-semibold">{packageData.courseCount} courses</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border p-4 sm:col-span-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-semibold">{formatDate(packageData.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
