'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

interface CollapsibleFiltersProps {
  categoryName?: string
  categorySlug?: string
  defaultValues: {
    q: string
    min: number | undefined
    max: number | undefined
    sort: string | undefined
  }
  isShopPage?: boolean
}

export function CollapsibleFilters({ 
  categoryName, 
  categorySlug, 
  defaultValues,
  isShopPage = false
}: CollapsibleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Price range state - set reasonable defaults for party supplies
  const MIN_PRICE = 0
  const MAX_PRICE = 1000
  const [priceRange, setPriceRange] = useState<[number, number]>([
    defaultValues.min ?? MIN_PRICE,
    defaultValues.max ?? MAX_PRICE
  ])

  const searchPlaceholder = isShopPage 
    ? "Search products..." 
    : `Search ${categoryName?.toLowerCase()}...`
  
  const resetUrl = isShopPage ? "/shop" : `/category/${categorySlug}`

  const handlePriceChange = (newRange: number[]) => {
    setPriceRange([newRange[0], newRange[1]])
  }

  return (
    <section aria-label="Filters" className="rounded-lg border border-border bg-card">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 md:p-4"
        aria-expanded={isOpen}
        aria-controls="filter-content"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Collapsible Filter Content */}
      {isOpen && (
        <div id="filter-content" className="border-t border-border p-3 md:p-4">
          <form method="get" className="grid gap-4 md:grid-cols-2 md:items-end md:gap-6">
            {/* Price Range Slider */}
            <div className="flex flex-col gap-3 md:col-span-2">
              <label className="text-sm font-medium">
                Price range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="px-2">
                <Slider
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={1}
                  value={priceRange}
                  onValueChange={handlePriceChange}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹{MIN_PRICE}</span>
                <span>₹{MAX_PRICE}</span>
              </div>
              {/* Hidden inputs for form submission */}
              <input
                type="hidden"
                name="min"
                value={priceRange[0] === MIN_PRICE ? "" : priceRange[0]}
              />
              <input
                type="hidden"
                name="max"
                value={priceRange[1] === MAX_PRICE ? "" : priceRange[1]}
              />
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1">
              <label htmlFor="sort" className="text-sm font-medium">
                Sort by
              </label>
              <select
                id="sort"
                name="sort"
                defaultValue={defaultValues.sort}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Actions */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 md:w-auto"
              >
                Apply
              </button>
              <Link
                href={resetUrl}
                className="ml-2 inline-block text-sm text-primary underline-offset-2 hover:underline"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}