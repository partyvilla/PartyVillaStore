"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils/currency"
import { ShoppingCart, AlertCircle } from "lucide-react"

type Product = {
  id: string | number
  name: string
  price: number
  image_url?: string[]
  img?: string
  imgAlt?: string
  variant?: string
  stock?: number
  variants?: Array<{ id: string | number; price: number;[key: string]: any }>
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { id, name, price, image_url, img, imgAlt, variant, stock, variants } = product

  const validVariants = Array.isArray(variants) ? variants : [];
  const inStockVariant = validVariants.find(v => typeof v.stock === 'number' && v.stock > 0) || null;
  const firstVariant = validVariants.length > 0 ? validVariants[0] : null;

  const displayPrice = inStockVariant && typeof inStockVariant.price === 'number'
    ? inStockVariant.price
    : (firstVariant && typeof firstVariant.price === 'number' ? firstVariant.price : price);
  const displayStock = inStockVariant && typeof inStockVariant.stock === 'number'
    ? inStockVariant.stock
    : (firstVariant && typeof firstVariant.stock === 'number' ? firstVariant.stock : (typeof stock === 'number' ? stock : 0));

  const getValidImageUrl = () => {
    if (inStockVariant && typeof inStockVariant.img === 'string' && inStockVariant.img.trim() !== '') {
      return inStockVariant.img;
    }
    if (Array.isArray(image_url) && image_url.length > 0) {
      const firstImage = image_url[0];
      if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
        return firstImage;
      }
    }
    if (img && typeof img === 'string' && img.trim() !== '') {
      return img;
    }
    return "/placeholder.svg?height=300&width=300&query=product";
  };

  const displayImg = getValidImageUrl();
  const [imageError, setImageError] = useState(false);
  const isOutOfStock = !inStockVariant;

  return (
    <div className="group h-full flex flex-col bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <Link href={`/product/${id}`} prefetch={true} className="relative overflow-hidden bg-muted flex-shrink-0">
        <div className="relative w-full aspect-square">
          <Image
            src={imageError ? "/placeholder.svg?height=300&width=300&query=product" : displayImg}
            alt={imgAlt || name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-foreground/90 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Out of Stock
              </div>
            </div>
          )}

          {displayStock > 0 && displayStock <= 5 && !isOutOfStock && (
            <div className="absolute top-3 right-3 bg-primary text-white px-2.5 py-1 rounded-full text-xs font-semibold">
              Only {displayStock} left
            </div>
          )}
        </div>
      </Link>

      {/* Content Container */}
      <div className="flex flex-col gap-4 flex-grow p-4">
        {/* Product Info */}
        <Link href={`/product/${id}`} className="group flex-grow">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        {/* Price and Stock */}
        <div className="space-y-2 border-t border-border/50 pt-3">
          <p className="text-lg font-bold text-primary">
            {formatCurrency(displayPrice)}
          </p>
        </div>

        {/* Add to Cart Button */}
        <Button
          asChild={!isOutOfStock}
          disabled={isOutOfStock}
          className="w-full mt-auto"
          variant="default"
        >
          <Link href={`/product/${id}`} className="flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

