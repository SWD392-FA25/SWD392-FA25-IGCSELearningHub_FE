"use client"
import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderDetailModal } from "@/components/ui/order-detail-modal"
import { orderService } from "@/services/order-service"
import { OrderSummary } from "@/types/api-types"

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [pageNumber])

  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await orderService.getMyOrdersPaginated(pageNumber, pageSize)
      if (response.succeeded && response.data) {
        setOrders(response.data)
        setTotalPages(response.totalPages)
        setTotalCount(response.totalCount)
      } else {
        setError(response.message || "Failed to load orders")
      }
    } catch (err) {
      setError("Failed to load orders. Please try again later.")
      console.error("Error loading orders:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrderId(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Orders & Payment</h1>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-muted-foreground text-sm">
                    Showing {orders.length} of {totalCount} orders
                  </div>
                  {totalPages > 1 && (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded border text-sm"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                      >
                        Previous
                      </button>
                      <span className="px-2 text-sm">Page {pageNumber} / {totalPages}</span>
                      <button
                        className="px-3 py-1 rounded border text-sm"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on any order row to view detailed information including order status and payment history.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border bg-card">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order ID</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Order Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Total Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Lines</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">No orders found.</td>
                      </tr>
                    ) : (
                      orders.map(order => (
                        <tr 
                          key={order.orderId} 
                          className="hover:bg-muted/20 transition-colors cursor-pointer" 
                          onClick={() => handleOrderClick(order.orderId)}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">{order.orderId}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {(() => {
                              const date = new Date(order.orderDate + 'Z'); // Add Z to indicate UTC
                              return date.toLocaleString('vi-VN', { 
                                timeZone: 'Asia/Ho_Chi_Minh',
                                year: 'numeric',
                                month: '2-digit', 
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm text-primary font-semibold">
                            {order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{order.lines}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center text-primary hover:text-primary/80">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Details
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />

      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
