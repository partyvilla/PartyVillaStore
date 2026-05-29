import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { getTrendingProducts, Product } from "@/lib/database/services/supabase-products"
import { getCategories } from "@/lib/database/services/supabase-categories"
import { Truck, Lock, CheckCircle, Headphones, ArrowRight } from "lucide-react"

export default async function Page() {
  let dbCategories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    dbCategories = await getCategories()
  } catch (error) {
    dbCategories = []
  }

  const categoriesData = dbCategories
  const categories = categoriesData.map(cat => ({
    name: cat.name,
    href: `/category/${cat.slug}`,
    imgAlt: `${cat.name} products`,
    img: cat.image || "/placeholder.svg?height=72&width=72&query=category",
  }))

  const trending = await getTrendingProducts(8)

  return (
    <main>
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative overflow-hidden py-20 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/partyvilla.png)',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Overlay with filters */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

        <div className="mx-auto max-w-6xl px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-white font-semibold text-lg tracking-widest uppercase drop-shadow">Welcome to PartyVilla</p>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">
                  <span className="text-white">Celebrate</span> <span className="text-primary">Every Moment</span>
                </h1>
                <p className="text-lg text-gray-100 max-w-lg leading-relaxed drop-shadow">
                  Discover our curated collection of premium party supplies, decorations, and celebration essentials to make your events unforgettable.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-primary/80 hover:bg-primary text-white">
                  <Link href="/shop">
                    Explore Collection
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white hover:bg-white/70 text-primary hover:text-primary">
                  <Link href="/categories">Browse Categories</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Shop Smart</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Browse by Category</h2>
            </div>
            <Link href="/categories" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group">
                <div className="relative overflow-hidden rounded-xl bg-muted aspect-square mb-3 shadow-sm hover:shadow-lg transition-all duration-300">
                  <Image
                    src={cat.img || "/placeholder.svg?height=240&width=240&query=category"}
                    alt={cat.imgAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    width={240}
                    height={240}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>

          <Link href="/categories" className="md:hidden flex items-center justify-center gap-2 text-primary hover:gap-3 transition-all font-semibold mt-8">
            View All Categories <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="bg-muted py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Trending Now</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Popular Picks</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
              Shop All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {trending.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <Link href="/shop" className="md:hidden flex items-center justify-center gap-2 text-primary hover:gap-3 transition-all font-semibold mt-8">
            Shop All Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ===== VALUE PROPOSITION SECTION ===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-2">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Premium Quality & Service</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              We're committed to making your celebrations special with exceptional products and dedicated customer support
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Fast Delivery */}
            <div className="bg-secondary rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-sm text-foreground/60">Quick shipping on all your party supplies</p>
            </div>

            {/* Secure Checkout */}
            <div className="bg-accent rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Secure Payment</h3>
              <p className="text-sm text-foreground/60">Your data is protected with us</p>
            </div>

            {/* Quality Assured */}
            <div className="bg-muted rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Premium Quality</h3>
              <p className="text-sm text-foreground/60">Curated selection for your special occasions</p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-primary/5 rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Expert Support</h3>
              <p className="text-sm text-foreground/60">Dedicated team ready to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary to-accent/20 py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Celebrate?</h2>
          <p className="text-lg text-foreground/70 mb-8">Start shopping and create memories with PartyVilla</p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}


