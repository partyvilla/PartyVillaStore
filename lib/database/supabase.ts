import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from "@/lib/database/database.types"

// Prevent multiple client instances in the browser
let browserClientInstance: any = null

// Function to reset the browser client instance
export const resetBrowserClient = () => {
  if (typeof window !== 'undefined') {
    browserClientInstance = null
  }
}

// For client components only - safe to use in auth provider
export const createBrowserClient = () => {
  if (typeof window !== 'undefined' && browserClientInstance) {
    return browserClientInstance
  }
  
  try {
    // Create new instance for browser environment
    browserClientInstance = createClientComponentClient<Database>()
    
    return browserClientInstance
  } catch (e) {
    // Fallback to generic client
    return createGenericClient()
  }
}

// Generic client for non-specific environments
export const createGenericClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required!')
  }
  
  return createSupabaseClient<Database>(url, key)
}

// For backward compatibility
export const createClient = createGenericClient
export const supabase = createBrowserClient()
