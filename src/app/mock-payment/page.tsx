"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function MockPaymentContent() {
  const search = useSearchParams()
  const orderId = search.get('orderId')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    document.title = 'Mock Payment'
  }, [])

  const handleComplete = () => {
    // notify opener (the course page) that payment succeeded
    try {
      if (window.opener) {
        window.opener.postMessage({ type: 'payment_success', orderId }, window.location.origin)
      }
    } catch {
      // ignore
    }
    setCompleted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-xl w-full p-8 bg-card border border-border rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Mock Payment Page</h1>
        <p className="text-sm text-muted-foreground mb-6">Order ID: {orderId}</p>

        {!completed ? (
          <div>
            <p className="mb-4">Thanh toán bằng mockup data.</p>
            <button onClick={handleComplete} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg">Complete payment</button>
          </div>
        ) : (
          <div>
            <p className="text-green-600 font-semibold mb-4">Thanh toán thành công.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MockPaymentContent />
    </Suspense>
  )
}
