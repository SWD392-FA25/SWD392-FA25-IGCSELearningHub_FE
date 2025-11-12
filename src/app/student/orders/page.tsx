"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { orderService } from "@/services/order-service"
import { Order } from "@/types/api-types"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getMyOrders()
      if (response.succeeded && response.data) {
        setOrders(response.data)
      } else {
        setError(response.message || "Failed to load orders")
      }
    } catch (err) {
      setError("Failed to load your orders. Please try again later.")
      console.error("Error loading orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '✅'
      case 'pending':
        return '⏳'
      case 'cancelled':
        return '❌'
      case 'processing':
        return '🔄'
      default:
        return '📋'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Please log in to view your orders</h1>
            <Link
              href="/login"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Go to Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your orders...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <button 
              onClick={loadOrders}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="w-full py-16 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">My Orders</h1>
            <p className="text-lg text-muted-foreground">
              Track your course purchases and payment history
            </p>
          </div>
        </section>

        {/* Orders List */}
        <section className="w-full py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">🛒</div>
                <h2 className="text-2xl font-semibold text-foreground mb-4">No orders yet</h2>
                <p className="text-muted-foreground mb-6">Start shopping for courses to see your orders here</p>
                <Link
                  href="/courses"
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-2xl">{getStatusIcon(order.status)}</div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between py-2 border-b border-border">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{order.course.title}</p>
                              <p className="text-sm text-muted-foreground">Course Purchase</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-foreground">${order.amount.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">{order.currency}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            Payment Method: {order.paymentMethod || 'Not specified'}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Total Amount</p>
                            <p className="text-xl font-bold text-primary">${order.amount.toFixed(2)} {order.currency}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {order.status === 'completed' && (
                          <button 
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                            onClick={() => {
                              // Download receipt logic
                              alert("Receipt download feature coming soon!")
                            }}
                          >
                            Download Receipt
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            onClick={() => {
                              // Complete payment logic
                              alert("Payment processing feature coming soon!")
                            }}
                          >
                            Complete Payment
                          </button>
                        )}
                        {order.status === 'cancelled' && (
                          <button 
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium"
                            onClick={() => {
                              // Reorder logic
                              alert("Reorder feature coming soon!")
                            }}
                          >
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}