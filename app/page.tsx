import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import { getTrendingProducts, Product } from "@/lib/database/services/supabase-products"
import { getCategories } from "@/lib/database/services/supabase-categories"

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
    <main className="space-y-6">
      {/* Enhanced Hero Banner with more sophisticated design - mobile optimized */}
      <section className="w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <div className="mx-auto max-w-6xl px-2 xs:px-4 py-4 sm:py-8 md:py-12">
          <div className="grid items-center gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-3 sm:space-y-4 order-2 md:order-1 z-10">
              <div className="inline-block px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                New Arrivals for September
              </div>
              <h1 className="text-pretty text-2xl sm:text-3xl font-bold tracking-tight text-primary md:text-5xl leading-tight">
                Make Every <span className="text-secondary">Celebration</span> Special
              </h1>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed md:text-base max-w-md">
                Elevate your events with our premium selection of balloons, decorations, and personalized party essentials.
              </p>
              <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Button asChild className="bg-primary text-white hover:bg-primary/90 px-4 xs:px-6 sm:px-8 py-2 xs:py-4 sm:py-6 text-xs sm:text-sm rounded-md shadow-md hover:shadow-lg transition-all duration-200">
                  <Link href="/shop" prefetch={true}>Shop Collection</Link>
                </Button>
              </div>
            </div>
            <div className="relative order-1 md:order-2 z-0">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-secondary/10 rounded-full filter blur-3xl"></div>
                <div className="relative rounded-lg overflow-hidden shadow-lg border border-primary/10">
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

      {/* Enhanced Category Tiles with modern design - mobile optimized */}
      <section className="py-6 sm:py-8 md:py-10">
        <div className="mx-auto max-w-6xl px-2 xs:px-4">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">Shop By Category</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Explore our curated collections</p>
            </div>
            <Link 
              href="/categories" 
              className="text-primary text-xs sm:text-sm font-medium flex items-center group mt-2 xs:mt-0" 
              aria-label="View all categories"
            >
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="focus:outline-none group">
                <div className="bg-white border border-primary/10 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 group-hover:transform group-hover:-translate-y-1">
                  <div className="h-24 xs:h-28 sm:h-32 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                    <Image
                      src={cat.img || "/placeholder.svg?height=128&width=240&query=category"}
                      alt={cat.imgAlt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      width={240}
                      height={128}
                    />
                  </div>
                  <div className="p-2 sm:p-3 text-center bg-gradient-to-b from-white to-primary/5">
                    <h3 className="text-xs sm:text-sm font-semibold text-primary truncate">{cat.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Trending Products with sophisticated design - mobile optimized */}
      <section className="py-6 sm:py-8 md:py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="mx-auto max-w-6xl px-2 xs:px-4 relative z-10">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-primary">Trending Now</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Our most popular celebrations essentials</p>
            </div>
            <Link 
              href="/shop" 
              className="text-primary text-xs sm:text-sm font-medium flex items-center group mt-2 xs:mt-0" 
              aria-label="View all products"
            >
              <span>View all</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4">
            {trending.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      
    </main>
  )
}
