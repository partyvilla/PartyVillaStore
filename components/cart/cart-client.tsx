"use client"

import Link from "next/link"
import { CartLineItem } from "@/components/cart/cart-line-item"
import { OrderSummary } from "@/components/checkout/order-summary"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"

export function CartClient() {
  const { items, clear } = useCart()

  if (items.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-border bg-card p-6 text-center">
        <h1 className="text-pretty text-xl font-semibold md:text-2xl">Your cart is empty</h1>
        <p className="text-sm text-muted-foreground">Browse our categories and start adding items to your cart.</p>
        <Button asChild className="bg-primary text-primary-foreground hover:opacity-90">
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <section className="md:col-span-2 space-y-3">
        {items.map((it: CartItem) => (
          <CartLineItem key={`${it.id}-${it.variant ?? "default"}`} item={it} />
        ))}
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
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
            Clear Cart
          </Button>
          <Button
            variant="default"
            size="sm"
            className="bg-primary text-primary-foreground hover:opacity-90"
            asChild
          >
            <Link href="/checkout">Go to Checkout</Link>
          </Button>
        </div>
      </section>
      <aside className="md:col-span-1">
        <OrderSummary />
      </aside>
    </div>
  )
}
