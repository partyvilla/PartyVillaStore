"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils/currency"

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

  // Find the first in-stock variant
  const validVariants = Array.isArray(variants) ? variants : [];
  const inStockVariant = validVariants.find(v => typeof v.stock === 'number' && v.stock > 0) || null;
  const firstVariant = validVariants.length > 0 ? validVariants[0] : null;

  // Use in-stock variant for display, else fallback to first variant or product
  const displayPrice = inStockVariant && typeof inStockVariant.price === 'number'
    ? inStockVariant.price
    : (firstVariant && typeof firstVariant.price === 'number' ? firstVariant.price : price);
  const displayStock = inStockVariant && typeof inStockVariant.stock === 'number'
    ? inStockVariant.stock
    : (firstVariant && typeof firstVariant.stock === 'number' ? firstVariant.stock : (typeof stock === 'number' ? stock : 0));

  // Use image from in-stock variant if available, else fallback to first valid image_url, img, or placeholder
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
    return "/placeholder.svg?height=192&width=320&query=product image";
  };

  const displayImg = getValidImageUrl();
  const [imageError, setImageError] = useState(false);
  // Out of stock if no variant is in stock
  const isOutOfStock = !inStockVariant;

  return (
    <div className="group h-full bg-white border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 hover:-translate-y-1">
      <div className="relative">
        <Link href={`/product/${id}`} prefetch={true}>
          <div className="relative overflow-hidden h-36 xs:h-40 sm:h-48">
            <Image
              src={imageError ? "/placeholder.svg?height=192&width=320&query=product image" : displayImg}
              alt={imgAlt || name}
              className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              width={320}
              height={192}
              onError={() => setImageError(true)}
            />

            {/* Out of Stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>
      <div className="p-2 xs:p-3 sm:p-4">
        <Link href={`/product/${id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="line-clamp-2 text-md xs:text-sm font-medium capitalize text-gray-800 mb-1 xs:mb-2 min-h-[2rem] xs:min-h-[2.5rem] group-hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0 xs:gap-1">
            {/* Show price and stock from first in-stock variant if available */}
            <p className="font-bold text-primary text-lg xs:text-base">
              {formatCurrency(displayPrice)}
            </p>
            {displayStock <= 5 && displayStock > 0 && !isOutOfStock && (
              <p className="text-xs text-orange-600 font-medium">Only {displayStock} left!</p>
            )}
          </div>
            <Link href={`/product/${id}`} prefetch={true}>
            <Button
              size="sm"
              variant="outline"
              className="p-2 xs:p-3 rounded-3 transition-all duration-200 cursor-pointer"
              disabled={isOutOfStock}
            >
              Add to cart
            </Button>
            </Link>
        </div>
      </div>
    </div>
  )
}
