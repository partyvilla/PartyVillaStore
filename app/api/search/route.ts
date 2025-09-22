import { NextRequest, NextResponse } from 'next/server'
import { getProducts, type Product } from '@/lib/database/services/supabase-products'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const limit = searchParams.get('limit')

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ suggestions: [], hasMore: false })
  }

  try {
    // Get products that match the search query
    const products = await getProducts({
      q: query.trim(),
      limit: limit ? parseInt(limit) : 8
    })

    // Format suggestions for dropdown
    const suggestions = products.map((product: Product) => {
      // Extract price from variants
      let price = 0;
      if (product.variants && Array.isArray(product.variants)) {
        const firstVariant = product.variants[0];
        price = firstVariant?.price || 0;
      }

      // Extract first image from image_url array
      let imageUrl = null;
      if (product.image_url) {
        if (Array.isArray(product.image_url) && product.image_url.length > 0) {
          imageUrl = product.image_url[0];
        } else if (typeof product.image_url === 'string') {
          imageUrl = product.image_url;
        }
      }

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        image_url: imageUrl,
        description: product.description,
        price
      }
    })

    // Also search in product descriptions for better matching
    const descriptionMatches = await getProducts({
      limit: limit ? parseInt(limit) : 8
    })

    const additionalSuggestions = descriptionMatches
      .filter((product: Product) => 
        product.description?.toLowerCase().includes(query.toLowerCase()) &&
        !suggestions.find((s: any) => s.id === product.id)
      )
      .map((product: Product) => {
        // Extract price from variants
        let price = 0;
        if (product.variants && Array.isArray(product.variants)) {
          const firstVariant = product.variants[0];
          price = firstVariant?.price || 0;
        }

        // Extract first image from image_url array
        let imageUrl = null;
        if (product.image_url) {
          if (Array.isArray(product.image_url) && product.image_url.length > 0) {
            imageUrl = product.image_url[0];
          } else if (typeof product.image_url === 'string') {
            imageUrl = product.image_url;
          }
        }

        return {
          id: product.id,
          name: product.name,
          category: product.category,
          image_url: imageUrl,
          description: product.description,
          price
        }
      })

    const allSuggestions = [...suggestions, ...additionalSuggestions]
      .slice(0, limit ? parseInt(limit) : 8)

    return NextResponse.json({
      suggestions: allSuggestions,
      hasMore: allSuggestions.length === (limit ? parseInt(limit) : 8)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    )
  }
}