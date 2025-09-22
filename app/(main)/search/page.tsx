"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getProducts, type Product } from "@/lib/database/services/supabase-products"
import { getCategories, type Category } from "@/lib/database/services/supabase-categories"
import { ProductCard } from "@/components/products/product-card"
import { Search } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchProducts = async () => {
      if (!query.trim()) {
        setProducts([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await getProducts({ 
          q: query.trim(),
          limit: 50 // Show more results on search page
        })
        setProducts(results)
      } catch (error) {
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    searchProducts()
  }, [query])

  useEffect(() => {
    // Load categories for popular categories section
    const loadCategories = async () => {
      try {
        const dbCategories = await getCategories()
        // Show first 5 categories as popular categories
        setCategories(dbCategories.slice(0, 5))
      } catch (error) {
        setCategories([])
      }
    }
    
    loadCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-primary mb-4" />
            <p className="text-gray-600">Searching for products...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          
          {query && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-600">
                Showing results for: <span className="font-semibold text-gray-900">"{query}"</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {products.length} product{products.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Enter a search term
            </h2>
            <p className="text-gray-600">
              Start typing to search for balloons, decorations, gifts, and more!
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any products matching "{query}". Try:
            </p>
            <div className="text-left max-w-md mx-auto space-y-2 text-sm text-gray-600">
              <p>• Check your spelling</p>
              <p>• Use more general terms (e.g., "balloon" instead of "red balloon")</p>
              <p>• Try different keywords</p>
              <p>• Browse our categories for inspiration</p>
            </div>
            
            {/* Suggest popular categories */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Popular Categories
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}