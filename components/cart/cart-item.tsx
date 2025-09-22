
"use client"

import { formatCurrency } from "@/lib/utils/currency"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useCart, type CartItem as ICartItem } from "@/hooks/use-cart"
import { cn } from "@/lib/utils/utils"
import { toast } from "@/components/ui/use-toast"

export function CartItem({ item }: { item: ICartItem }) {
  const { setQuantity, removeItem } = useCart()

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="h-16 w-16 overflow-hidden rounded border border-border">
          {item.img ? (
            <Image
              src={item.img || "/placeholder.svg"}
              alt={item.name}
              width={64}
              height={64}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <img src="/diverse-products-still-life.png" alt={item.name} className="h-16 w-16 object-cover" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              {item.variant ? <p className="text-xs text-muted-foreground">Variant: {item.variant}</p> : null}
            </div>
            <p className="text-sm font-semibold">{formatCurrency(item.price * item.qty)}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label htmlFor={`qty-${item.id}`} className="sr-only">
              Quantity for {item.name}
            </label>
            <Input
              id={`qty-${item.id}`}
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) => {
                // Allow direct entry of any number
                const rawValue = e.target.value;
                const newQty = Number(rawValue) || 1;
                
                // Only set quantity if it's valid
                if (newQty >= 1) {
                  setQuantity(item.id, newQty, item.variant);
                }
                
                // Remove toast notification for quantity changes
                // Simpler UX without constant notifications
              }}
              className={cn("h-9 w-20")}
            />
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                removeItem(item.id, item.variant)
                toast({
                  title: "Item Removed",
                  description: `${item.name}${item.variant ? ` (${item.variant})` : ''} removed from your cart`,
                  variant: "default",
                  duration: 3000,
                })
              }}
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
