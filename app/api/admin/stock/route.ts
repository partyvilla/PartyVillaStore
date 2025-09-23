import { NextResponse } from 'next/server'
import { createRouteHandler } from '@/lib/database/supabase-server'

// Load admin emails from environment variables
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) 
  : [
    "partyvilla.store@gmail.com"
  ]

// GET all products with stock info for admin
export async function GET(request: Request) {
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

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, category, variants, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}

// PUT update stock - Not supported since stock is managed at variant level
// Use /api/admin/stock/variant endpoint instead
export async function PUT(request: Request) {
  return NextResponse.json(
    { 
      error: 'Product-level stock updates not supported. Use /api/admin/stock/variant endpoint to update individual variant stock.' 
    },
    { status: 400 }
  )
}
