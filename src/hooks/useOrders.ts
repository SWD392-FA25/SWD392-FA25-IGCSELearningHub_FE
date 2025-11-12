import { useState, useEffect } from 'react'
import { orderService } from '@/services/order-service'
import { OrderSummary } from '@/types/api-types'

export const useOrders = (pageNumber: number = 1, pageSize: number = 20) => {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrevious, setHasPrevious] = useState(false)

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await orderService.getMyOrdersPaginated(pageNumber, pageSize)
      
      if (response.succeeded && response.data) {
        setOrders(response.data)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
        setHasNext(response.hasNext)
        setHasPrevious(response.hasPrevious)
      } else {
        setError(response.message || 'Failed to load orders')
      }
    } catch (err) {
      setError('Failed to load orders. Please try again later.')
      console.error('Error loading orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [pageNumber, pageSize])

  return {
    orders,
    loading,
    error,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
    refetch: loadOrders
  }
}