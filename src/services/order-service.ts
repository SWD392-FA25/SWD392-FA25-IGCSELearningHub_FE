import { apiClient } from './api-client'
import { ApiResponse, Order, OrderDetail, OrderStatus, CheckoutRequest, CheckoutResponse } from '@/types/api-types'

class OrderService {
  // POST /api/v1/me/orders - Create new order
  async createOrder(courseId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>('/me/orders', {
      courseId
    })
  }

  // GET /api/v1/me/orders - Get my orders
  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>('/me/orders')
  }

  // GET /api/v1/me/orders/{orderId} - Get order detail
  async getOrderById(orderId: string): Promise<ApiResponse<OrderDetail>> {
    return apiClient.get<ApiResponse<OrderDetail>>(`/me/orders/${orderId}`)
  }

  // GET /api/v1/me/orders/{orderId}/status - Get order status
  async getOrderStatus(orderId: string): Promise<ApiResponse<OrderStatus>> {
    return apiClient.get<ApiResponse<OrderStatus>>(`/me/orders/${orderId}/status`)
  }

  // POST /api/v1/me/orders/{orderId}/checkout - Initialize payment
  async checkout(orderId: string, checkoutData: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> {
    return apiClient.post<ApiResponse<CheckoutResponse>>(`/me/orders/${orderId}/checkout`, checkoutData)
  }

  // POST /api/v1/me/orders/{orderId}/retry-checkout - Retry payment if failed
  async retryCheckout(orderId: string, checkoutData: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> {
    return apiClient.post<ApiResponse<CheckoutResponse>>(`/me/orders/${orderId}/retry-checkout`, checkoutData)
  }

  // Cancel order (if available)
  async cancelOrder(orderId: string): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>(`/me/orders/${orderId}/cancel`)
  }
}

export const orderService = new OrderService()