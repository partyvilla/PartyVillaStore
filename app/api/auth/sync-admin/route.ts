import { NextResponse } from 'next/server'
import { syncAdminStatus } from '@/lib/auth/admin-auth'

export async function GET(request: Request) {
  try {
    const isAdmin = await syncAdminStatus()
    
    return NextResponse.json({
      success: true,
      isAdmin
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync admin status' },
      { status: 500 }
    )
  }
}
