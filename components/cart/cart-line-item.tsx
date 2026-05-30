"use client"

import React from "react"
import { useCart, type CartItem } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils/currency"
import { toast } from "@/components/ui/use-toast"
import { Minus, Plus } from "lucide-react"

export function CartLineItem({ item }: { item: CartItem }) {
  const { setQuantity, removeItem } = useCart()
  const [isUpdating, setIsUpdating] = React.useState(false)

  // Support img as string or string[] - ensure we don't use empty strings
  const getValidImageUrl = () => {
    if (Array.isArray(item.img) && item.img.length > 0) {
      const firstImage = item.img[0]
      if (firstImage && firstImage.trim() !== '') {
        return firstImage
      }
    }
    if (typeof item.img === 'string' && item.img.trim() !== '') {
      return item.img
    }
    return "/placeholder.svg"
  }

  const imgSrc = getValidImageUrl()

  const handleIncreaseQuantity = async () => {
    if (isUpdating) return;
    
    // Check if we're already at the stock limit
    if (item.stock && item.qty >= item.stock) {
      toast({
        title: "Stock Limit Reached",
        description: `Only ${item.stock} items available in stock.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      await setQuantity(item.id, item.qty + 1, item.variant)
    } catch (error) {
      toast({
        title: "Cannot Increase Quantity",
        description: error instanceof Error ? error.message : "Failed to update quantity",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  const handleDecreaseQuantity = async () => {
    if (isUpdating || item.qty <= 1) return;
    setIsUpdating(true);
    try {
      await setQuantity(item.id, item.qty - 1, item.variant)
    } catch (error) {
      toast({
        title: "Cannot Decrease Quantity",
        description: error instanceof Error ? error.message : "Failed to update quantity",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUpdating(false);
    }
  }

  const handleRemoveItem = async () => {
    try {
      await removeItem(item.id, item.variant)
      toast({
        title: "Item Removed",
        description: `${item.name}${item.variant ? ` (${item.variant})` : ''} removed from your cart`,
        variant: "default",
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Cannot Remove Item",
        description: error instanceof Error ? error.message : "Failed to remove item from cart",
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <img
        src={imgSrc}
        alt={item.name}
        className="h-16 w-16 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.name}</p>
            {item.variant && <p className="text-xs text-muted-foreground">Variant: {item.variant}</p>}
            {item.stock !== undefined && (
              <p className="text-xs text-muted-foreground">
                {item.qty >= item.stock ? (
                  <span className="text-orange-600">At stock limit ({item.stock} available)</span>
                ) : (
                  <span></span>
                )}
              </p>
            )}
          </div>
          <p className="shrink-0 text-sm font-semibold">{formatCurrency(item.price * item.qty)}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecreaseQuantity}
              disabled={item.qty <= 1 || isUpdating}
              className="h-8 w-8 p-0"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-[2rem] px-2 text-center text-sm font-medium">
              {item.qty}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleIncreaseQuantity}
              disabled={isUpdating || (item.stock !== undefined && item.qty >= item.stock)}
              className="h-8 w-8 p-0"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveItem}
            aria-label={`Remove ${item.name}${item.variant ? ` (${item.variant})` : ''}`}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}
