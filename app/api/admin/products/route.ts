import { NextResponse } from 'next/server'
import { createRouteHandler } from '@/lib/database/supabase-server'
import { createProduct, getProducts } from '@/lib/database/services/supabase-products'

// Load admin emails from environment variables (same as in middleware.ts)
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) 
  : [
    // Fallback for development - remove in production
    "partyvilla.store@gmail.com"
  ]

// GET /api/admin/products - List all products
export async function GET(request: Request) {
  try {
    // Create a Supabase client that has access to the request context (cookies)
    const supabase = await createRouteHandler()
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is admin based on email
    const isAdmin = ADMIN_EMAILS.includes(session.user.email || '')
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    // Get all products
    const products = await getProducts()
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: Request) {
  try {
    // Create a Supabase client that has access to the request context (cookies)
    const supabase = await createRouteHandler()
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Check if the user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin based on email
    const isAdmin = ADMIN_EMAILS.includes(session.user.email || '')
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    // Sync the user's admin status in the profiles table
    try {
      await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          role: 'admin'
        }, { onConflict: 'id' })
    } catch (err) {
      // Continue execution even if sync fails
    }
    
    // Parse the request body as FormData
    const formData = await request.formData()
    
    // Extract product data from FormData
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const variants = formData.get('variants') ? JSON.parse(formData.get('variants') as string) : []
    const existingImage = formData.get('existingImage') as string || null
    const images = formData.getAll('images') as File[]

    // Basic validation
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name and category are required' },
        { status: 400 }
      )
    }
    if (!Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { error: 'At least one variant is required' },
        { status: 400 }
      )
    }
    if (variants.some(v => v.price === undefined || v.stock === undefined)) {
      return NextResponse.json(
        { error: 'Each variant must have price and stock' },
        { status: 400 }
      )
    }
    
    // Handle image upload (multiple images)
    let imageUrls: string[] = []
    if (images.length > 0) {
      try {
        const { uploadImageToCloudinary } = await import('@/lib/services/cloudinary')
        for (const image of images) {
          if (image && image.size > 0) {
            const uploadResult = await uploadImageToCloudinary(image)
            imageUrls.push(uploadResult.url)
          }
        }
      } catch (uploadError) {
        return NextResponse.json(
          { error: 'Failed to upload image', details: uploadError instanceof Error ? uploadError.message : String(uploadError) },
          { status: 500 }
        )
      }
    }
    // If no new images, but existingImage is present, use it
    if (imageUrls.length === 0 && existingImage) {
      imageUrls = [existingImage]
    }
    // Prepare product data for database (match DB schema)
    const productData = {
      name,
      category,
      description,
      image_url: imageUrls.length > 0 ? imageUrls : null, // array or null
      variants // array of objects
    }
    const newProduct = await createProduct(productData)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
