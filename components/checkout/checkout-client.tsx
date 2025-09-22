"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { OrderSummary } from "@/components/checkout/order-summary"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { createBrowserClient } from "@/lib/database/supabase"

interface UserProfile {
  id?: string
  user_id: string
  name?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  pincode?: string | null
  role?: string
  created_at?: string
  updated_at?: string
}

export function CheckoutClient() {
  const router = useRouter()
  const { items, clear } = useCart()
  const supabase = createBrowserClient()

  const [pincode, setPincode] = useState("")
  const [pincodeAvailable, setPincodeAvailable] = useState<null | boolean>(null)
  const [checkingPincode, setCheckingPincode] = useState(false)
  const [shippingCharge, setShippingCharge] = useState<number>(0)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const pincodeTimeout = useRef<NodeJS.Timeout | null>(null)

  // Fetch user profile and prefill address
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user?.id) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()

          if (data && !error) {
            setUserProfile(data)
            // Prefill pincode if available
            if (data.pincode) {
              setPincode(data.pincode)
              // Check pincode availability automatically
              checkPincodeAvailability(data.pincode)
            }
          }
        }
      } catch (error) {
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [])

  if (items.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-center">
        <h2 className="text-pretty text-xl font-semibold md:text-2xl">Your cart is empty</h2>
        <Button onClick={() => router.push("/")} className="bg-primary text-primary-foreground hover:opacity-90">
          Continue Shopping
        </Button>
      </div>
    )
  }

  // Check pincode availability and fetch shipping charge
  async function checkPincodeAvailability(pin: string) {
    setCheckingPincode(true)
    setPincodeAvailable(null)
    setShippingCharge(0)
    try {
      const res = await fetch(`/api/pincode-availability?pincode=${encodeURIComponent(pin)}`)
      const data = await res.json()
      setPincodeAvailable(!!data.available)
      setShippingCharge(data.delivery_charge ?? 0)
    } catch (e) {
      setPincodeAvailable(false)
      setShippingCharge(0)
    } finally {
      setCheckingPincode(false)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (pincode.length !== 6 || pincodeAvailable !== true || checkingPincode) {
      return
    }

    const formData = new FormData(e.currentTarget)
    const deliveryAddress = {
      fullName: formData.get('fullName') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address1') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      pincode: formData.get('pincode') as string,
    }

    // Store checkout data in sessionStorage for use on payments page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('checkoutData', JSON.stringify({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          img: item.img,
          variant: item.variant // Ensure variant is included
        })),
        delivery_address: deliveryAddress,
        total_price: items.reduce((sum, item) => sum + (item.price * item.qty), 0) + shippingCharge,
        shipping_charge: shippingCharge,
      }))
    }

    router.push("/payments")
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="md:col-span-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-border bg-card p-4 md:p-6" autoComplete="off">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          {loadingProfile && (
            <div className="text-sm text-muted-foreground">Loading your saved address...</div>
          )}
          {!loadingProfile && userProfile && (userProfile.name || userProfile.address) && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
              ✓ Your saved address has been automatically filled below. You can modify any details if needed.
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                required
                placeholder="John Doe"
                defaultValue={userProfile?.name || ""}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+91 98765 43210"
                defaultValue={userProfile?.phone || ""}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="address1" className="text-sm font-medium">
              Address
            </label>
            <input
              id="address1"
              name="address1"
              required
              placeholder="House no, Street, Area"
              defaultValue={userProfile?.address || ""}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <input
                id="city"
                name="city"
                required
                placeholder="Mumbai"
                defaultValue={userProfile?.city || ""}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <input
                id="state"
                name="state"
                required
                placeholder="Maharashtra"
                defaultValue={userProfile?.state || ""}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="pincode" className="text-sm font-medium">
                Pincode
              </label>
              <div className="relative">
                <input
                  id="pincode"
                  name="pincode"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="400001"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring pr-10"
                  value={pincode}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                    setPincode(val)
                    setPincodeAvailable(null)
                    if (pincodeTimeout.current) clearTimeout(pincodeTimeout.current)
                    if (val.length === 6) {
                      pincodeTimeout.current = setTimeout(() => {
                        checkPincodeAvailability(val)
                      }, 500)
                    }
                  }}
                />
                {checkingPincode && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-spin">⏳</span>
                )}
                {pincodeAvailable === true && !checkingPincode && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 text-xs">✔️</span>
                )}
                {pincodeAvailable === false && !checkingPincode && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 text-xs">❌</span>
                )}
              </div>
              {pincode.length === 6 && pincodeAvailable === false && !checkingPincode && (
                <span className="text-xs text-red-600">Delivery not available to this pincode</span>
              )}
              {pincode.length === 6 && pincodeAvailable === true && !checkingPincode && (
                <span className="text-xs text-green-600">Delivery available!</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Payment Method</h3>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background p-2 text-sm opacity-70">
                <input type="radio" name="payment" value="upi" defaultChecked />
                UPI
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background p-2 text-sm opacity-70">
                <input type="radio" name="payment" value="card" disabled />
                Card (coming soon)
              </label>
            </div>
          </div>
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
              disabled={pincode.length !== 6 || pincodeAvailable !== true || checkingPincode}
            >
              {checkingPincode ? "Checking pincode..." : "Proceed to Payment"}
            </Button>
          </div>
        </form>
      </section>

      <aside className="md:col-span-1">
        <OrderSummary shipping={shippingCharge} />
      </aside>
    </div>
  )
}
