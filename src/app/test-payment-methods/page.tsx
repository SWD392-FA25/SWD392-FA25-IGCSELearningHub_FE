"use client"
import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { PaymentMethodSelector } from '@/components/ui/payment-method-selector'
import { PaymentMethod } from '@/types/api-types'

export default function PaymentMethodsTestPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Methods Test</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <PaymentMethodSelector
                selectedPaymentMethodId={selectedPaymentMethod?.id}
                onSelect={handlePaymentMethodSelect}
                className="mb-6"
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Selected Payment Method</h2>
              {selectedPaymentMethod ? (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">ID:</span> {selectedPaymentMethod.id}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span> {selectedPaymentMethod.name}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span> {selectedPaymentMethod.description}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        selectedPaymentMethod.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedPaymentMethod.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No payment method selected</p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}