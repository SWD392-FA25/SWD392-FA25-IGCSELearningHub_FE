import { apiClient } from './api-client'
import { ApiResponse, PaginatedApiResponse, Order, OrderDetail, OrderStatus, CheckoutRequest, CheckoutResponse, OrderSummary } from '@/types/api-types'

class OrderService {
  // POST /api/v1/me/orders - Create new order (legacy)
  async createOrder(courseId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<ApiResponse<Order>>('/me/orders', {
      courseId
    })
  }

  // POST /api/v1/me/orders - Create new order with items structure
  async createOrderWithItems(items: { itemType: string; itemId: number; quantity: number }[]): Promise<ApiResponse<OrderDetail>> {
    return apiClient.post<ApiResponse<OrderDetail>>('/me/orders', {
      items
    })
  }

  // GET /api/v1/me/orders - Get my orders
  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<ApiResponse<Order[]>>('/me/orders')
  }

  // GET /api/v1/me/orders with pagination - Get my orders with pagination
  async getMyOrdersPaginated(pageNumber: number = 1, pageSize: number = 20): Promise<PaginatedApiResponse<OrderSummary[]>> {
    return apiClient.get<PaginatedApiResponse<OrderSummary[]>>(`/me/orders?pageNumber=${pageNumber}&pageSize=${pageSize}`)
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