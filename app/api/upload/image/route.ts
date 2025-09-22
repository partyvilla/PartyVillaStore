import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToCloudinary } from '@/lib/services/cloudinary'
import { createRouteHandler } from '@/lib/database/supabase-server'

// Load admin emails from environment variables
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) 
  : ["jsc.21905@gmail.com"]

export async function POST(request: NextRequest) {
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

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'party-villa-products'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary
    const result = await uploadImageToCloudinary(file, folder)

    return NextResponse.json({
      success: true,
      url: result.url,
      public_id: result.public_id
    })

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
