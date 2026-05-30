import Link from "next/link"
import { Metadata } from "next"

import { ProductCard } from "@/components/products/product-card"
import { getProducts } from "@/lib/database/services/supabase-products"
import { CollapsibleFilters } from "@/components/search/collapsible-filters"
import { ChevronRight, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Shop | PartyVilla",
  description: "Browse our full collection of party supplies, decorations, and celebration essentials.",
}

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

function toStringParam(v: unknown): string | undefined {
  if (typeof v === "string") return v
  if (Array.isArray(v)) return v[0]
  return undefined
}

export default async function ShopPage({ searchParams }: PageProps) {
  const awaitedSearchParams = await searchParams
  const q = toStringParam(awaitedSearchParams?.q) || ""
  const sort = (toStringParam(awaitedSearchParams?.sort) as "price-asc" | "price-desc") || undefined
  const min = Number(toStringParam(awaitedSearchParams?.min) || "")
  const max = Number(toStringParam(awaitedSearchParams?.max) || "")
  const minNum = Number.isFinite(min) ? min : undefined
  const maxNum = Number.isFinite(max) ? max : undefined

  const products = await getProducts({
    q,
    min: minNum,
    max: maxNum,
    sort
  })

  return (
    <main>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-secondary to-background py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-foreground/60 hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <span className="text-foreground font-semibold">Shop</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Our Collection</h1>
            <p className="text-lg text-foreground/70">Discover our entire range of premium party supplies and celebration essentials</p>
            <p className="text-sm text-foreground/60 font-medium">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex gap-8 lg:gap-12 flex-col lg:flex-row">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24 h-fit">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filters
              </h2>
              <CollapsibleFilters
                defaultValues={{
                  q,
                  min: minNum,
                  max: maxNum,
                  sort
                }}
                isShopPage={true}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6 w-full">
            <CollapsibleFilters
              defaultValues={{
                q,
                min: minNum,
                max: maxNum,
                sort
              }}
              isShopPage={true}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Search className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-lg text-foreground/60">No products found.</p>
                <p className="text-sm text-foreground/40 mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
