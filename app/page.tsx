import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { getTrendingProducts, Product } from "@/lib/database/services/supabase-products"
import { getCategories } from "@/lib/database/services/supabase-categories"
import { Zap, Lock, Award, Headphones } from "lucide-react"

export default async function Page() {
  // Try to get categories from database, fall back to default
  let dbCategories: Awaited<ReturnType<typeof getCategories>> = []
  try {
    dbCategories = await getCategories()
  } catch (error) {
    dbCategories = []
  }

  const categoriesData = dbCategories

  // Transform for CategoryShortcuts component
  const categories = categoriesData.map(cat => ({
    name: cat.name,
    href: `/category/${cat.slug}`,
    imgAlt: `${cat.name} products`,
    img: cat.image || "/placeholder.svg?height=72&width=72&query=category",
  }))

  const trending = await getTrendingProducts(6)

  return (
    <main className="space-y-0">
      {/* Announcement Bar */}
      <div className="w-full bg-accent text-foreground py-2 px-4 text-center text-sm font-medium">
        <p>Free delivery on selected orders • New party collections available</p>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12 md:py-16">
          <div className="grid items-center gap-6 sm:gap-8 md:grid-cols-2">
            <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
              <div className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                Celebrate Every Moment
              </div>
              <h1 className="text-pretty text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Make Every Celebration Feel Beautifully Planned
              </h1>
              <p className="text-foreground/70 text-sm sm:text-base leading-relaxed max-w-md">
                Shop curated party supplies, gifts, decorations, balloons, and celebration essentials for every occasion.
              </p>
              <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-md shadow-md hover:shadow-lg transition-all duration-200">
                  <Link href="/shop" prefetch={true}>Shop Now</Link>
                </Button>
                <Button asChild variant="outline" className="px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-md border-primary text-primary hover:bg-primary/5">
                  <Link href="/shop" prefetch={true}>Explore Categories</Link>
                </Button>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/party-villa banner.webp"
                  alt="Festive celebration with party decorations and balloons"
                  className="w-full object-cover h-60 md:h-[405px]"
                  width={1200}
                  height={405}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Discovery Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Shop By Category</h2>
              <p className="text-sm text-foreground/60 mt-1">Explore our curated collections</p>
            </div>
            <Link
              href="/categories"
              className="text-primary text-sm font-medium flex items-center group mt-3 xs:mt-0 hover:gap-2 transition-all"
              aria-label="View all categories"
            >
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="focus:outline-none group">
                <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="h-24 xs:h-28 sm:h-32 overflow-hidden relative bg-muted">
                    <Image
                      src={cat.img || "/placeholder.svg?height=128&width=240&query=category"}
                      alt={cat.imgAlt}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      width={240}
                      height={128}
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-muted">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Trending Now</h2>
              <p className="text-sm text-foreground/60 mt-1">Our most popular celebration essentials</p>
            </div>
            <Link
              href="/shop"
              className="text-primary text-sm font-medium flex items-center group mt-3 xs:mt-0 hover:gap-2 transition-all"
              aria-label="View all products"
            >
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {trending.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Benefits Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Why Choose PartyVilla?</h2>
            <p className="text-sm sm:text-base text-foreground/60">Quality, convenience, and celebration expertise</p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-4">
            {/* Fast Delivery */}
            <div className="bg-secondary rounded-lg p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 mb-4">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-xs sm:text-sm text-foreground/60">Quick shipping on all orders</p>
            </div>

            {/* Secure Checkout */}
            <div className="bg-accent rounded-lg p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 mb-4">
                <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Secure Checkout</h3>
              <p className="text-xs sm:text-sm text-foreground/60">Your data is safe with us</p>
            </div>

            {/* Quality Products */}
            <div className="bg-muted rounded-lg p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 mb-4">
                <Award className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Quality Assured</h3>
              <p className="text-xs sm:text-sm text-foreground/60">Premium party supplies for every event</p>
            </div>

            {/* Easy Support */}
            <div className="bg-primary/5 rounded-lg p-6 sm:p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 mb-4">
                <Headphones className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Easy Support</h3>
              <p className="text-xs sm:text-sm text-foreground/60">24/7 customer assistance</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

