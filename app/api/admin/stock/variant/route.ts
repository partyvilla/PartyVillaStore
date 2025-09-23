import { NextResponse } from 'next/server'
import { createRouteHandler } from '@/lib/database/supabase-server'

// Load admin emails from environment variables
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) 
  : [
    "partyvilla.store@gmail.com"
  ]

// PUT update stock for a specific variant
export async function PUT(request: Request) {
  try {
    const supabase = await createRouteHandler()
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const isAdmin = ADMIN_EMAILS.includes(session.user.email || '')
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    const { productId, variantIndex, newStock } = body

    if (!productId || typeof variantIndex !== 'number' || variantIndex < 0 || typeof newStock !== 'number' || newStock < 0) {
      return NextResponse.json(
        { error: 'Invalid product ID, variant index, or stock quantity' },
        { status: 400 }
      )
    }

    // First, get the current product data
    const { data: currentProduct, error: fetchError } = await supabase
      .from('products')
      .select('variants')
      .eq('id', productId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
    }


    // Update the specific variant's stock
    let variants = currentProduct.variants || []
    
    
    // Parse variants if they're stored as a JSON string
    if (typeof variants === 'string') {
      try {
        variants = JSON.parse(variants)
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid variants data format' },
          { status: 500 }
        )
      }
    }
    
    // Ensure variants is an array
    if (!Array.isArray(variants)) {
      variants = []
    }
    
    if (variantIndex >= variants.length) {
      return NextResponse.json(
        { error: 'Invalid variant index' },
        { status: 400 }
      )
    }

    variants[variantIndex] = {
      ...variants[variantIndex],
      stock: newStock
    }

    // Update the product with new variants data
    const { data: product, error } = await supabase
      .from('products')
      .update({ 
        variants: JSON.stringify(variants),
        updated_at: new Date().toISOString() 
      })
      .eq('id', productId)
      .select('id, name, category, variants, created_at, updated_at')
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update variant stock' },
        { status: 500 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update variant stock' },
      { status: 500 }
    )
  }
}