
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/products/product-card"
import { ProductGallery } from "@/components/products/product-gallery"
import { AddToCartClient } from "@/components/cart/add-to-cart-client"
import { getProductById, getProducts, type Product } from "@/lib/database/services/supabase-products"
import { getCategoryBySlug } from "@/lib/database/services/supabase-categories"
import { ChevronRight, Truck, RefreshCw, ShieldCheck } from "lucide-react"

type PageProps = { params: Promise<{ id: string }> }

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params

  const product = await getProductById(id)
  if (!product) return notFound()

  const category = await getCategoryBySlug(product.category)

  const allProducts = await getProducts({ category: product.category })
  const related = allProducts.filter((p: { id: string }) => p.id !== product.id).slice(0, 4)

  const variants = Array.isArray(product.variants) ? product.variants : []
  const images = Array.isArray(product.image_url) && product.image_url.length > 0 ? product.image_url : [product.img || "/placeholder.svg"]
  const img = Array.isArray(product.image_url) && product.image_url.length > 0 ? product.image_url[0] : (product.img || "")

  return (
    <main>
      {/* Breadcrumb */}
      <div className="bg-muted/50 py-4">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-foreground/60 hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <Link href="/shop" className="text-foreground/60 hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <Link href={`/category/${product.category}`} className="text-foreground/60 hover:text-primary transition-colors">
              {category?.name ?? "Category"}
            </Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <span className="text-foreground font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="order-2 lg:order-1">
            <ProductGallery images={images} alt={product.imgAlt || product.name} />
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2 space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div>
                {category && (
                  <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">
                    {category.name}
                  </p>
                )}
                <h1 className="text-4xl font-bold text-foreground leading-tight">{product.name}</h1>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-primary" />
                  ))}
                </div>
                <span className="text-sm text-foreground/60">(12 reviews)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-foreground/70 leading-relaxed border-b border-border/50 pb-8">
              {product.description}
            </p>

            {/* Add to Cart Section */}
            <div className="space-y-6 border-b border-border/50 pb-8">
              <AddToCartClient
                id={product.id}
                name={product.name}
                img={img}
                variants={variants}
                fallbackPrice={product.price}
                fallbackStock={product.stock}
              />
            </div>

            {/* Features */}
            <div className="space-y-4 bg-muted rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Fast & Free Delivery</h3>
                  <p className="text-sm text-foreground/60">On orders over ₹500</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Easy Returns</h3>
                  <p className="text-sm text-foreground/60">15-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Secure Payment</h3>
                  <p className="text-sm text-foreground/60">100% secure transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20 space-y-8 border-t border-border/50 pt-20">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Related Products</h2>
              <p className="text-foreground/60">You might also like these items</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
          </div>
        )}
      </div>
    </main>
  )
}
