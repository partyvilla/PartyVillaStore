import { createGenericClient } from "@/lib/database/supabase"
import { Database } from "@/lib/database/database.types"

type DatabaseProduct = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

// Frontend Product type with transformed fields for compatibility
export type Product = DatabaseProduct & {
  img?: string // Mapped from image_url for frontend compatibility
  imgAlt?: string // Generated from name for frontend compatibility
  price: number // Computed from first variant price
}

export async function getProducts(options?: {
  category?: string
  q?: string
  min?: number
  max?: number
  sort?: 'price-asc' | 'price-desc'
  limit?: number
}) {
  // Use the generic client to bypass RLS issues in server environments
  const supabase = createGenericClient()
  
  let query = supabase
    .from('products')
    .select('*')

  if (options?.category) {
    if (options.category === 'trending') {
      // For trending, we'll mix products from all categories but limit results
      query = query.limit(options?.limit || 8)
    } else {
      query = query.eq('category', options.category)
    }
  }

  if (options?.q) {
    query = query.ilike('name', `%${options.q}%`)
  }

  // Apply price filters using JSONB operators on variants
  // Since price is stored in variants[0].price, we need to use JSONB path operations
  if (options?.min !== undefined && options.min > 0) {
    // Filter where the first variant's price is >= min
    query = query.gte('variants->0->>price', options.min.toString())
  }

  if (options?.max !== undefined && options.max > 0) {
    // Filter where the first variant's price is <= max
    query = query.lte('variants->0->>price', options.max.toString())
  }

  // For sorting, we'll need to handle this differently since we can't directly sort by JSONB
  // We'll fetch all data first and sort in memory for now
  let sortInMemory = false;
  if (options?.sort) {
    sortInMemory = true;
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    return []
  }

  // Transform the data to match frontend expectations
  if (!data) return [];
  
  let transformedProducts = data.map((product: DatabaseProduct) => {
    // Extract price from first variant
    let price = 0;
    if (product.variants) {
      try {
        const variants = typeof product.variants === 'string' 
          ? JSON.parse(product.variants) 
          : product.variants;
        if (Array.isArray(variants) && variants.length > 0) {
          price = variants[0]?.price || 0;
        }
      } catch (error) {
      }
    }

    return {
      ...product,
      img: product.image_url, // Map image_url to img for frontend compatibility
      imgAlt: product.name, // Use name as alt text since we don't have img_alt field
      price, // Add computed price
      variants: product.variants ? (
        typeof product.variants === 'string' 
          ? (() => {
              try {
                return JSON.parse(product.variants)
              } catch (error) {
                return null
              }
            })()
          : product.variants
      ) : null, // Parse variants from JSON string if needed
    }
  })

  // Apply in-memory sorting if needed
  if (sortInMemory && options?.sort) {
    const ascending = options.sort === 'price-asc'
    transformedProducts.sort((a, b) => {
      if (ascending) {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })
  }

  return transformedProducts
}

export async function getProductById(id: string) {
  const { createServerClient } = await import('@/lib/database/supabase-server')
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id) // ID is now uuid, not integer
    .single()

  if (error) {
    return null
  }

  // Transform the data to match frontend expectations
  return data ? {
    ...data,
    img: data.image_url, // Map image_url to img for frontend compatibility
    imgAlt: data.name, // Use name as alt text since we don't have img_alt field
    variants: data.variants ? (
      typeof data.variants === 'string' 
        ? (() => {
            try {
              return JSON.parse(data.variants)
            } catch (error) {
              return null
            }
          })()
        : data.variants
    ) : null, // Parse variants from JSON string if needed
  } : null
}

export async function getTrendingProducts(limit = 6) {
  try {
    const { createServerClient } = await import('@/lib/database/supabase-server')
    const supabase = await createServerClient()
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }) // In a real app, would be based on sales/views
      .limit(limit)
  
    if (error) {
      throw error
    }
  
    // If no products found in database, return empty array instead of mock data
    if (!data || data.length === 0) {
      return []
    }
    
    // Transform the data to match frontend expectations
    return data.map(product => ({
      ...product,
      img: product.image_url, // Map image_url to img for frontend compatibility
      imgAlt: product.name, // Use name as alt text since we don't have img_alt field
    }))
  } catch (err) {
    // Return empty array instead of fallback to mock data
    return []
  }
}

export async function createProduct(product: ProductInsert & { img?: string, variants?: any }) {
  // Get a fresh supabase client instance
  const { createRouteHandler } = await import('@/lib/database/supabase-server')
  const supabase = await createRouteHandler();
  
  // Insert only fields present in DB schema
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.name,
      description: product.description || null,
      category: product.category,
      image_url: product.image_url ?? null, // array or null
      variants: Array.isArray(product.variants) ? product.variants : null // store as array
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function updateProduct(id: string, updates: ProductUpdate & { variants?: any }) {
  const { createServerClient } = await import('@/lib/database/supabase-server')
  const supabase = await createServerClient()
  
  // Handle variants and image_url - keep arrays as arrays for JSONB storage
  const updateData = { ...updates }
  
  // Keep variants as array for jsonb storage
  if (updateData.variants !== undefined) {
    updateData.variants = Array.isArray(updateData.variants) ? updateData.variants : null
  }
  
  // Keep image_url as array for json storage
  if (updateData.image_url !== undefined) {
    updateData.image_url = Array.isArray(updateData.image_url) ? updateData.image_url : updateData.image_url
  }
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id) // ID is now uuid, not integer
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteProduct(id: string) {
  const { createServerClient } = await import('@/lib/database/supabase-server')
  const supabase = await createServerClient()
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id) // ID is now uuid, not integer

  if (error) {
    throw error
  }
}
