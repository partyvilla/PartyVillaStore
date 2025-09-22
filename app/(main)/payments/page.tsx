"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { getOrderTotal } from "@/components/checkout/order-summary"

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })


const upiId = process.env.NEXT_PUBLIC_SHOP_UPI_ID || "demo@upi"
const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Party Villa"


function getCheckoutTotal() {
  if (typeof window === 'undefined') return ''
  try {
    const data = JSON.parse(sessionStorage.getItem('checkoutData') || '{}')
    if (data && data.items && Array.isArray(data.items)) {
      // Use shipping_charge from checkoutData if available
      const shipping = typeof data.shipping_charge === 'number' ? data.shipping_charge : 0
      const total = getOrderTotal(data.items, shipping)
      return total.toString()
    }
    return ''
  } catch {
    return ''
  }
}


export default function PaymentsPage() {
  const [upiRef, setUpiRef] = useState("")
  const [payeeName, setPayeeName] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [amount, setAmount] = useState<string>("")
  const [upiRefError, setUpiRefError] = useState<string>("")
  const router = useRouter()

  React.useEffect(() => {
    setAmount(getCheckoutTotal())
  }, [])

  const upiIntent = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(shopName)}&am=${encodeURIComponent(amount)}&cu=INR`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Validate UPI Ref length
    if (upiRef.length < 12 || upiRef.length > 16) {
      setUpiRefError("UPI Ref number must be 12 to 16 digits long.")
      return
    } else {
      setUpiRefError("")
    }

    // Get checkout data from sessionStorage
    let checkoutData = null
    if (typeof window !== 'undefined') {
      try {
        checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}')
      } catch {}
    }
    if (!checkoutData || !checkoutData.items || !checkoutData.delivery_address) {
      alert('Checkout data missing. Please go back and try again.')
      return
    }

    // Prepare order payload
    const payload = {
      items: checkoutData.items,
      delivery_address: checkoutData.delivery_address,
      total_price: Number(amount),
      upi_ref: upiRef,
      payee_name: payeeName
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) {
        alert(result.error || 'Failed to create order')
        return
      }
      setSubmitted(true)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('checkoutData')
        // Clear cart
        localStorage.removeItem('partyvilla_cart')
      }
      alert('Payment details submitted! We will verify and process your order soon.')
      router.push('/')
    } catch (err) {
      alert('Failed to create order. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-card rounded-lg border border-border shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Pay with UPI</h1>
      <div className="flex flex-col items-center mb-6">
        <div className="bg-white p-2 rounded">
          <QRCode value={upiIntent} style={{ height: 180, width: 180 }} />
        </div>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Scan this QR with your UPI app<br />
          <span className="font-medium">UPI ID:</span> {upiId}<br />
          <span className="font-medium">Shop Name:</span> {shopName}<br />
          <span className="font-medium">Amount:</span> ₹{amount}
        </p>
        <div className="mt-2 flex justify-center">
          <a
            href={upiIntent}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-primary-foreground font-semibold rounded px-4 py-2 shadow hover:opacity-90 transition"
          >
            Pay Now
          </a>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="upiRef" className="block text-sm font-medium mb-1">UPI Reference Number</label>
          <input
            id="upiRef"
            required
            value={upiRef}
            onChange={e => {
              setUpiRef(e.target.value.replace(/[^0-9A-Za-z]/g, ""))
              setUpiRefError("")
            }}
            minLength={12}
            maxLength={16}
            className={`w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${upiRefError ? 'border-red-500' : ''}`}
            placeholder="Enter UPI Ref No."
          />
          {upiRefError && <p className="text-xs text-red-600 mt-1">{upiRefError}</p>}
        </div>
        <div>
          <label htmlFor="payeeName" className="block text-sm font-medium mb-1">Payee Name</label>
          <input
            id="payeeName"
            required
            value={payeeName}
            onChange={e => setPayeeName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter Payee Name as shown in your UPI app"
          />
          <p className="text-xs text-muted-foreground mt-1">
            <span className="font-medium">Note:</span> The payee name must be correct. This will be used for payment verification by the shop owner.
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground rounded-md py-2 font-semibold hover:opacity-90"
        >
          Submit Payment Details
        </button>
        {/* Success message now handled by alert and redirect */}
      </form>
    </div>
  )
}
