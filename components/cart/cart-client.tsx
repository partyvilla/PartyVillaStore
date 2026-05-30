"use client"

import Link from "next/link"
import { CartLineItem } from "@/components/cart/cart-line-item"
import { OrderSummary } from "@/components/checkout/order-summary"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"
import { ShoppingBag, Trash2, ArrowRight } from "lucide-react"

export function CartClient() {
  const { items, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-12 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
            <ShoppingBag className="w-10 h-10 text-foreground/40" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h1>
            <p className="text-foreground/60">Start browsing and add some celebration essentials to get started!</p>
          </div>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/shop" className="flex items-center gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-border bg-muted/50">
            <h2 className="font-semibold text-foreground">Order Items ({items.length})</h2>
          </div>

          {/* Items */}
          <div className="divide-y divide-border/50">
            {items.map((it: CartItem) => (
              <CartLineItem key={`${it.id}-${it.variant ?? "default"}`} item={it} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/5"
            onClick={() => {
              clear();
              toast({
                title: "Cart Cleared",
                description: "All items have been removed from your cart",
                variant: "default",
                duration: 3000,
              });
            }}
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </Button>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 flex items-center gap-2">
            <Link href="/checkout">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <OrderSummary />
        </div>
      </div>
    </div>
  )
}
