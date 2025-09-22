"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

export function AddToCartClient({
  id,
  name,
  img,
  variants = [],
  fallbackPrice,
  fallbackStock,
}: {
  id: string
  name: string
  img: string
  variants?: Array<{ name: string; price: number; stock: number }>
  fallbackPrice?: number
  fallbackStock?: number
}) {
  const { addItem, getCartQty } = useCart()
  const router = useRouter()
  // Default to first variant if exists
  const [selectedVariant, setSelectedVariant] = useState(variants.length > 0 ? variants[0].name : undefined)
  const [qty, setQty] = useState<number>()
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cartQty, setCartQty] = useState<number>(0) // default quantity is 0
  const [loadingQty, setLoadingQty] = useState<boolean>(false)
  const [notAuthenticated, setNotAuthenticated] = useState<boolean>(false)

  // Find the selected variant object
  const variantObj = variants.find(v => v.name === selectedVariant)
  const price = variantObj ? variantObj.price : fallbackPrice || 0
  const stock = variantObj ? variantObj.stock : fallbackStock || 0
  const isOutOfStock = stock === 0
  const maxQuantity = Math.min(stock, 99)

  // Fetch cart quantity for this product/variant
  useEffect(() => {
    let mounted = true
    setLoadingQty(true)
    getCartQty(id, selectedVariant).then(qty => {
      if (mounted) {
        if (qty === null || typeof qty === 'undefined') {
          setNotAuthenticated(true)
          setCartQty(0)
        } else {
          setNotAuthenticated(false)
          setCartQty(qty)
        }
        setLoadingQty(false)
      }
    }).catch(() => {
      if (mounted) {
        setNotAuthenticated(true)
        setCartQty(0)
        setLoadingQty(false)
      }
    })
    return () => { mounted = false }
  }, [id, selectedVariant, getCartQty])

  const isMaxInCart = cartQty >= stock && stock > 0

  async function handleAddToCart() {
    setError(null)
    if (isOutOfStock) {
      setError("This variant is currently out of stock")
      return
    }
    if (isMaxInCart) {
      setError("You have already added the maximum available quantity to your cart.")
      return
    }
    if ((qty || 0) > stock - cartQty) {
      setError(`Only ${stock - cartQty} more items available. Please reduce the quantity.`)
      return
    }
    setIsAdding(true)
    try {
      await addItem({ id, name, price, img, variant: selectedVariant }, qty)
      setTimeout(() => {
        setIsAdding(false)
        router.push("/cart")
      }, 500)
    } catch (error) {
      setIsAdding(false)
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart"
      setError(errorMessage)
    }
  }

  return (
    <div className="space-y-3">
      {/* Stock Status */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          {isOutOfStock ? (
            <span className="text-red-600 font-semibold">Out of Stock</span>
          ) : stock <= 5 ? (
            <span className="text-orange-600 font-semibold">Only {stock} left in stock!</span>
          ) : (
            <span className="text-green-600">In Stock ({stock} available)</span>
          )}
        </div>
        <div className="font-bold text-lg">{price ? `₹${price}` : null}</div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {variants.length > 0 && (
        <div className="flex flex-col gap-1">
          <label htmlFor="variant" className="text-sm font-medium">
            Variant
          </label>
          <select
            id="variant"
            value={selectedVariant}
            onChange={(e) => {
              setSelectedVariant(e.target.value)
              setQty(undefined)
              setError(null)
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {variants.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label htmlFor="qty" className="sr-only">
          Quantity
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          max={Math.max(1, stock - cartQty)}
          value={qty || ""}
          placeholder="1"
          onChange={(e) => {
            const inputValue = e.target.value
            if (inputValue === "") {
              setQty(undefined)
            } else {
              const newQty = Math.max(0, Math.min(stock - cartQty, Number(inputValue)))
              setQty(newQty)
            }
            if (error) setError(null)
          }}
          disabled={isOutOfStock || isMaxInCart || loadingQty || notAuthenticated}
          className="w-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || isOutOfStock || isMaxInCart || loadingQty || notAuthenticated}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-all duration-200 ${
            isOutOfStock || isMaxInCart || loadingQty || notAuthenticated
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : isAdding 
                ? "bg-green-500 text-white scale-95" 
                : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {notAuthenticated
            ? "Login to add"
            : isOutOfStock
              ? "Out of Stock"
              : loadingQty
                ? "Checking..."
                : isMaxInCart
                  ? "Max Added"
                  : isAdding
                    ? "Added!"
                    : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
