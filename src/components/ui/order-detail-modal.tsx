import React, { useState, useEffect } from 'react'
import { Modal, Descriptions, Table, Tag, Button, Popconfirm, message, Card, Alert, Spin } from 'antd'
import { EyeOutlined, CreditCardOutlined, LoadingOutlined } from '@ant-design/icons'
import { orderService } from '@/services/order-service'
import { OrderDetail, OrderStatus, CheckoutRequest } from '@/types/api-types'

interface OrderDetailModalProps {
  orderId: number | null
  isOpen: boolean
  onClose: () => void
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose
}) => {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetail()
      fetchOrderStatus()
    }
  }, [isOpen, orderId])

  const fetchOrderDetail = async () => {
    if (!orderId) return
    
    setLoading(true)
    setError('')
    try {
      const response = await orderService.getOrderById(String(orderId))
      if (response.succeeded && response.data) {
        setOrderDetail(response.data)
      } else {
        console.warn('Failed to load order details, will show status only:', response.message)
        setOrderDetail(null)
      }
    } catch (err) {
      console.warn('Failed to load order details, will show status only:', err)
      setOrderDetail(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderStatus = async () => {
    if (!orderId) return
    
    try {
      const response = await orderService.getOrderStatus(String(orderId))
      if (response.succeeded && response.data) {
        setOrderStatus(response.data)
      }
    } catch (err) {
      console.error('Error loading order status:', err)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString.endsWith('Z') ? dateString : dateString + 'Z')
    return date.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const handlePayment = async () => {
    if (!orderId) return
    
    setProcessingPayment(true)
    try {
      const checkoutRequest: CheckoutRequest = {
        paymentMethod: 'credit_card'
      }
      
      const response = await orderService.checkout(String(orderId), checkoutRequest)
      
      if (response.succeeded && response.data?.checkoutUrl) {
        message.success('Redirecting to payment page...')
        
        window.location.href = response.data.checkoutUrl
      } else {
        message.error(response.message || 'Failed to generate payment link')
      }
    } catch (err) {
      console.error('Payment error:', err)
      message.error('Failed to process payment. Please try again later.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'orange'
      case 'completed': case 'paid': return 'green'
      case 'failed': case 'cancelled': return 'red'
      default: return 'default'
    }
  }

  const orderItemColumns = [
    {
      title: 'Item',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'itemType',
      key: 'itemType',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Line Total',
      dataIndex: 'lineTotal',
      key: 'lineTotal',
      render: (total: number) => formatPrice(total),
    },
  ]

  const paymentHistoryColumns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatPrice(amount),
    },
    {
      title: 'Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
  ]

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span>Order Details #{orderId}</span>
          {orderStatus?.status === 'Pending' && (
            <Popconfirm
              title="Generate Payment Link"
              description="Do you want to create a payment link for this order?"
              onConfirm={handlePayment}
              okText="Yes"
              cancelText="No"
              disabled={processingPayment}
            >
              <Button
                type="primary"
                icon={processingPayment ? <LoadingOutlined /> : <CreditCardOutlined />}
                loading={processingPayment}
                size="small"
              >
                {processingPayment ? 'Processing...' : 'Pay Now'}
              </Button>
            </Popconfirm>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={1000}
      style={{ maxHeight: '80vh' }}
    >
      <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>

        {error ? (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={fetchOrderDetail}>
                Try Again
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {orderStatus && (
              <Card title="Current Status" size="small">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Order ID">{orderStatus.orderId}</Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(orderStatus.status)}>{orderStatus.status}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Amount">
                    <strong style={{ color: '#1890ff' }}>{formatPrice(orderStatus.totalAmount)}</strong>
                  </Descriptions.Item>
                  {/* {orderStatus.lastPayment && (
                    <Descriptions.Item label="Last Payment" span={2}>
                      {JSON.stringify(orderStatus.lastPayment)}
                    </Descriptions.Item>
                  )} */}
                </Descriptions>
              </Card>
            )}

            {orderDetail && (
              <>
                <Card title="Order Information" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Order ID">{orderDetail.orderId}</Descriptions.Item>
                    <Descriptions.Item label="Date">{formatDate(orderDetail.orderDate)}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={getStatusColor(orderDetail.status)}>{orderDetail.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Amount">
                      <strong style={{ color: '#1890ff' }}>{formatPrice(orderDetail.totalAmount)}</strong>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                <Card title="Order Items" size="small">
                  <Table
                    columns={orderItemColumns}
                    dataSource={orderDetail.items}
                    rowKey="orderDetailId"
                    pagination={false}
                    size="small"
                  />
                </Card>
              </>
            )}

            {!orderDetail && orderStatus && (
              <Alert
                message="Order Status Only"
                description="Detailed order information is not available, but you can see the current order status above."
                type="info"
                showIcon
              />
            )}
          </div>
        )}
      </Spin>
    </Modal>
  )
}