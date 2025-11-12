import { useState, useEffect } from 'react'
import { paymentMethodService } from '@/services/payment-method-service'
import { PaymentMethod } from '@/types/api-types'

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadPaymentMethods = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await paymentMethodService.getActivePaymentMethods()
      
      if (response.succeeded && response.data) {
        setPaymentMethods(response.data)
      } else {
        setError(response.message || 'Failed to load payment methods')
      }
    } catch (err) {
      setError('Failed to load payment methods. Please try again later.')
      console.error('Error loading payment methods:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPaymentMethods()
  }, [])

  return {
    paymentMethods,
    loading,
    error,
    refetch: loadPaymentMethods
  }
}

export const usePaymentMethod = (id: string) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadPaymentMethod = async () => {
    if (!id) return

    try {
      setLoading(true)
      setError('')
      
      const response = await paymentMethodService.getPaymentMethodById(id)
      
      if (response.succeeded && response.data) {
        setPaymentMethod(response.data)
      } else {
        setError(response.message || 'Failed to load payment method')
      }
    } catch (err) {
      setError('Failed to load payment method. Please try again later.')
      console.error('Error loading payment method:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPaymentMethod()
  }, [id])

  return {
    paymentMethod,
    loading,
    error,
    refetch: loadPaymentMethod
  }
}