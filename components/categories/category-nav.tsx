"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/utils"
import { useEffect, useState } from "react"
import { Category, getCategories } from "@/lib/database/services/supabase-categories"

export function CategoryNav() {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const dbCategories = await getCategories()
        if (dbCategories.length > 0) {
          // Use database categories in their natural order
          setCategories(dbCategories)
        }
      } catch (error) {
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])
  
  return (
    <div className="w-full bg-white border-b border-border shadow-sm z-10">
      <div className="mx-auto max-w-6xl overflow-x-auto scrollbar-hide">
        <nav className="flex items-center py-2.5 gap-1.5 xs:gap-2 sm:gap-3 min-w-max">
          {isLoading ? (
            // Enhanced loading placeholders
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-primary/5 rounded-md h-9 w-28 mx-1"></div>
            ))
          ) : (
            <>
              {/* All Products option */}
              <Link
                href="/shop"
                prefetch={true}
                className={cn(
                  "px-3.5 py-2 text-xs sm:text-sm whitespace-nowrap rounded-md flex items-center gap-1.5 transition-all duration-200",
                  pathname === "/shop"
                    ? "text-white font-medium bg-primary shadow-sm"
                    : "text-primary/80 font-medium hover:text-primary hover:bg-primary/5"
                )}
              >
                <span>All Products</span>
              </Link>
              
              {(categories ?? []).map((category) => {
                const href = `/category/${category.slug}`
                const isActive = pathname?.includes(href)
                
                return (
                  <Link
                    key={category.id}
                    href={href}
                    prefetch={true}
                    className={cn(
                      "px-3.5 py-2 text-xs sm:text-sm whitespace-nowrap rounded-md flex items-center gap-1.5 transition-all duration-200",
                      isActive
                        ? "text-white font-medium bg-primary shadow-sm"
                        : "text-primary/80 font-medium hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <span>{category.name}</span>
                  </Link>
                )
              })}
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
