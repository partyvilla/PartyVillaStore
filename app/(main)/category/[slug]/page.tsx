import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/products/product-card"
import { getCategoryBySlug } from "@/lib/database/services/supabase-categories"
import { getProducts } from "@/lib/database/services/supabase-products"
import { CollapsibleFilters } from "@/components/search/collapsible-filters"
import { ChevronRight, Search } from "lucide-react"

type PageProps = {
  params: { slug: string }
  searchParams?: Record<string, string | string[] | undefined>
}

function toStringParam(v: unknown): string | undefined {
  if (typeof v === "string") return v
  if (Array.isArray(v)) return v[0]
  return undefined
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const slug = resolvedParams.slug;

  const category = await getCategoryBySlug(slug)
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }
  return {
    title: `${category.name} | PartyVilla`,
    description: category.description || `Shop our range of ${category.name} products`,
  }
}

export const revalidate = 3600

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams || {});

  const slug = resolvedParams.slug;
  const q = toStringParam(resolvedSearchParams.q) || ""
  const sort = (toStringParam(resolvedSearchParams.sort) as "price-asc" | "price-desc") || undefined
  const min = Number(toStringParam(resolvedSearchParams.min) || "")
  const max = Number(toStringParam(resolvedSearchParams.max) || "")
  const minNum = Number.isFinite(min) ? min : undefined
  const maxNum = Number.isFinite(max) ? max : undefined

  const category = await getCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  let products = await getProducts({
    category: slug,
    q,
    min: minNum,
    max: maxNum,
    sort,
    limit: 20
  })

  if (slug === 'trending' && (!products || products.length === 0)) {
    const { getTrendingProducts } = await import('@/lib/database/services/supabase-products');
    const trendingProducts = await getTrendingProducts(8);
    products = trendingProducts;
  }

  return (
    <main>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-secondary to-background py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-foreground/60 hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <span className="text-foreground font-semibold">{category.name}</span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{category.name}</h1>
            {category.description && (
              <p className="text-lg text-foreground/70 max-w-2xl">{category.description}</p>
            )}
            <p className="text-sm text-foreground/60 font-medium">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex gap-8 lg:gap-12">
          {/* Filters Sidebar (Desktop) */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24 h-fit">
              <h2 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filters
              </h2>
              <CollapsibleFilters
                categoryName={category.name}
                categorySlug={slug}
                defaultValues={{
                  q,
                  min: minNum,
                  max: maxNum,
                  sort
                }}
              />
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <CollapsibleFilters
              categoryName={category.name}
              categorySlug={slug}
              defaultValues={{
                q,
                min: minNum,
                max: maxNum,
                sort
              }}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <Search className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <p className="text-lg text-foreground/60">No products found in this category yet.</p>
                <p className="text-sm text-foreground/40 mt-2">Try browsing other categories or adjusting your filters.</p>
                <Link href="/shop" className="inline-block mt-6 text-primary font-semibold hover:underline">
                  ← Back to Shop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

