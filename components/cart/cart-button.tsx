"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function CartButton() {
  const { count } = useCart()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (count === 0) {
      e.preventDefault(); // Prevent navigation if cart is empty
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart first.",
        variant: "default",
        duration: 3000,
      })
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative p-2"
      onClick={(e) => handleClick(e)}
    >
      {count > 0 ? (
        <Link href="/cart" aria-label={`Cart with ${count} item${count === 1 ? "" : "s"}`}>
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="absolute -top-1 -right-1 text-xs font-medium bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
            {count}
          </span>
        </Link>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 text-primary" />
        </>
      )}
    </Button>
  )
}
