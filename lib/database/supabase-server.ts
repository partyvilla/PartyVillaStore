import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createGenericClient } from './supabase'
import type { Database } from './database.types'

// For use in server components
export const createServerClient = async () => {
  // Server components should use createServerComponentClient
  try {
    // Dynamic import to avoid importing next/headers in client components
    const { cookies } = require('next/headers')
    const cookieStore = await cookies()
    const client = createServerComponentClient<Database>({ cookies: () => cookieStore })
    return client;
  } catch (e) {
    // Fallback for non-server environments
    return createGenericClient()
  }
}

// For use in API route handlers
export const createRouteHandler = async () => {
  try {
    // Dynamic import to avoid importing next/headers in client components
    const { cookies } = require('next/headers')
    const cookieStore = await cookies()
    return createRouteHandlerClient<Database>({ cookies: () => cookieStore })
  } catch (e) {
    // Fallback for non-route handler environments
    return createGenericClient()
  }
}

// Create server client only when needed
export const getServerClient = () => createServerClient()

// For admin operations that require service role key
export const createAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !serviceKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env variables are required for admin operations!')
  }
  
  return createSupabaseClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
