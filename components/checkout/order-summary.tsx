"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { formatCurrency } from "@/lib/utils/currency"

export function getOrderTotal(items: Array<{ price: number; qty: number }>, shipping: number) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  return subtotal + (items.length > 0 ? shipping : 0)
}

export function OrderSummary({ shipping = 0 }: { shipping?: number }) {
  const { items } = useCart()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const total = getOrderTotal(items, shipping)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping Charges</span>
          <span>{items.length === 0 || shipping === 0 ? "—" : formatCurrency(shipping)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
