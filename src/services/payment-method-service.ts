import { apiClient } from './api-client'
import { ApiResponse, PaymentMethod } from '@/types/api-types'

class PaymentMethodService {
  async getActivePaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      return await apiClient.get<ApiResponse<PaymentMethod[]>>('/payment-methods/active')
    } catch (error) {
      console.error('Error fetching active payment methods:', error)
      
      // Return a mock response if API is not available
      return {
        succeeded: false,
        status: 'error',
        statusCode: 500,
        message: 'Failed to fetch payment methods',
        data: [],
        details: null,
        errors: error
      }
    }
  }

  async getAllPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      return await apiClient.get<ApiResponse<PaymentMethod[]>>('/payment-methods')
    } catch (error) {
      console.error('Error fetching all payment methods:', error)
      
      return {
        succeeded: false,
        status: 'error',
        statusCode: 500,
        message: 'Failed to fetch payment methods',
        data: [],
        details: null,
        errors: error
      }
    }
  }

  async getPaymentMethodById(id: string): Promise<ApiResponse<PaymentMethod>> {
    try {
      return await apiClient.get<ApiResponse<PaymentMethod>>(`/payment-methods/${id}`)
    } catch (error) {
      console.error('Error fetching payment method:', error)
      
      return {
        succeeded: false,
        status: 'error',
        statusCode: 500,
        message: 'Failed to fetch payment method',
        data: {} as PaymentMethod,
        details: null,
        errors: error
      }
    }
  }
}

export const paymentMethodService = new PaymentMethodService()