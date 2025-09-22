
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/products/product-card"
import { ProductGallery } from "@/components/products/product-gallery"
import { AddToCartClient } from "@/components/cart/add-to-cart-client"
import { getProductById, getProducts, type Product } from "@/lib/database/services/supabase-products"
import { getCategoryBySlug } from "@/lib/database/services/supabase-categories"

type PageProps = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  
  const product = await getProductById(id)
  if (!product) return notFound()

  // Get category details from database
  const category = await getCategoryBySlug(product.category)

  // Get related products from the same category
  const allProducts = await getProducts({ category: product.category })
  const related = allProducts.filter((p: { id: string }) => p.id !== product.id).slice(0, 3)

  // Prepare variant data
  const variants = Array.isArray(product.variants) ? product.variants : []
  const images = Array.isArray(product.image_url) && product.image_url.length > 0 ? product.image_url : [product.img || "/placeholder.svg"]
  const img = Array.isArray(product.image_url) && product.image_url.length > 0 ? product.image_url[0] : (product.img || "")


  // Pass all variants to AddToCartClient
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/category/${product.category}`} className="hover:underline">
              {category?.name ?? "Category"}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Product */}
      <section className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={images} alt={product.imgAlt || product.name} />

        <div className="space-y-5">
          <h1 className="text-pretty text-2xl font-semibold md:text-3xl">{product.name}</h1>
          {/* Show price and stock for selected variant (handled in AddToCartClient) */}
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Add to Cart */}
          <AddToCartClient
            id={product.id}
            name={product.name}
            img={img}
            variants={variants}
            fallbackPrice={product.price}
            fallbackStock={product.stock}
          />
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-pretty text-xl font-semibold md:text-2xl">You might also like</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {related.map((p: Product) => {
              const variants = Array.isArray(p.variants) ? p.variants : [];
              const firstVariant = variants.length > 0 ? variants[0] : null;
              return (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    price: firstVariant && typeof firstVariant.price === 'number' ? firstVariant.price : 0,
                    image_url: Array.isArray(p.image_url) ? p.image_url : (p.image_url ? [p.image_url] : []),
                    img: Array.isArray(p.image_url) && p.image_url.length > 0 ? p.image_url[0] : (p.img || ''),
                    imgAlt: p.imgAlt || p.name,
                    stock: firstVariant && typeof firstVariant.stock === 'number' ? firstVariant.stock : 0,
                    variants: variants
                  }}
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  )
}
