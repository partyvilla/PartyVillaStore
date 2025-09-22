import React from "react"
import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/products/product-card"
import { getCategoryBySlug } from "@/lib/database/services/supabase-categories"
import { getProducts } from "@/lib/database/services/supabase-products"
import { CollapsibleFilters } from "@/components/search/collapsible-filters"

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
  // Next.js App Router requires awaiting dynamic params
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

// Set a revalidation time to improve performance with caching
export const revalidate = 3600 // Revalidate every hour

export default async function CategoryPage({ params, searchParams }: PageProps) {
  // Next.js App Router requires awaiting dynamic params
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams || {});

  const slug = resolvedParams.slug;
  const q = toStringParam(resolvedSearchParams.q) || ""
  const sort = (toStringParam(resolvedSearchParams.sort) as "price-asc" | "price-desc") || undefined
  const min = Number(toStringParam(resolvedSearchParams.min) || "")
  const max = Number(toStringParam(resolvedSearchParams.max) || "")
  const minNum = Number.isFinite(min) ? min : undefined
  const maxNum = Number.isFinite(max) ? max : undefined

  // Get category from default categories first for better performance
  const category =  await getCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  // Use a promise to fetch products concurrently
  let products = await getProducts({
    category: slug,
    q,
    min: minNum,
    max: maxNum,
    sort,
    limit: 20 // Limit the number of products for better performance
  })

  // For trending category, use the dedicated getTrendingProducts function if no products found
  if (slug === 'trending' && (!products || products.length === 0)) {
    const { getTrendingProducts } = await import('@/lib/database/services/supabase-products');
    const trendingProducts = await getTrendingProducts(8);
    products = trendingProducts;
  }

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
            {category.name}
          </li>
        </ol>
      </nav>

      {/* Heading + count */}
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">{category.name}</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} item{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Filters */}
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

      {/* Results */}
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground">No products match your filters.</p>
      ) : (
        <section aria-label="Products">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
