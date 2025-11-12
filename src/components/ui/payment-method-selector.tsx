import React from 'react'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { PaymentMethod } from '@/types/api-types'

interface PaymentMethodSelectorProps {
  selectedPaymentMethodId?: number
  onSelect?: (paymentMethod: PaymentMethod) => void
  className?: string
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedPaymentMethodId,
  onSelect,
  className = ''
}) => {
  const { paymentMethods, loading, error } = usePaymentMethods()

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        <p>{error}</p>
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        <p>No payment methods available</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Payment Method
      </label>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onSelect?.(method)}
            className={`
              p-3 border rounded-lg cursor-pointer transition-colors
              ${selectedPaymentMethodId === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{method.name}</h3>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethodId === method.id}
                  onChange={() => onSelect?.(method)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PaymentMethodSelector