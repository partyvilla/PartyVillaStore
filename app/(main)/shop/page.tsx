import Link from "next/link"
import { Metadata } from "next"

import { ProductCard } from "@/components/products/product-card"
import { getProducts } from "@/lib/database/services/supabase-products"
import { CollapsibleFilters } from "@/components/search/collapsible-filters"

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
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:space-y-8 md:py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            Shop
          </li>
        </ol>
      </nav>

      {/* Heading + count */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Shop Our Collection</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} item{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Filters */}
      <CollapsibleFilters 
        defaultValues={{
          q,
          min: minNum,
          max: maxNum,
          sort
        }}
        isShopPage={true}
      />

      {/* Products grid */}
      <section aria-labelledby="products-heading">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No products found.</p>
          </div>
        )}
      </section>
    </main>
  )
}
