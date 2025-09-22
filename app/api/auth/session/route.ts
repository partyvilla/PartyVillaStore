import { NextResponse } from 'next/server'
import { createClient } from '@/lib/database/supabase'

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({
        user: null,
        authenticated: false
      })
    }
    
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email
      },
      authenticated: true
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get session' },
      { status: 500 }
    )
  }
}
