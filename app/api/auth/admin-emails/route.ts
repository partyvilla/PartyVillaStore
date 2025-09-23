import { NextResponse } from 'next/server'

// Load admin emails from environment variables for better security
// Matches the list in middleware.ts
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) 
  : [
    // Fallback for development - remove in production
    "partyvilla.store@gmail.com"
  ]

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      adminEmails: ADMIN_EMAILS
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get admin emails' },
      { status: 500 }
    )
  }
}
