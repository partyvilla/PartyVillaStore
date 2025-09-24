import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from "@/lib/database/database.types"
import { getAuthConfig, getStorageAdapter } from '@/lib/auth/session-storage'
import { validateSupabaseConfig } from '@/lib/auth/config-validator'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// UNIFIED SINGLETON - One instance for everything
let GLOBAL_SUPABASE_INSTANCE: any = null

// Reset helper (testing / manual hard reset)
export const resetBrowserClient = () => {
  GLOBAL_SUPABASE_INSTANCE = null
}

// UNIFIED CLIENT CREATOR - Works for both browser and server
const createUnifiedSupabaseClient = () => {
  if (GLOBAL_SUPABASE_INSTANCE) return GLOBAL_SUPABASE_INSTANCE

  try {
    if (typeof window !== 'undefined') {
      try {
        GLOBAL_SUPABASE_INSTANCE = createClientComponentClient<Database>()
      } catch (_e) {
        GLOBAL_SUPABASE_INSTANCE = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
          auth: {
            ...getAuthConfig(),
            storage: getStorageAdapter(),
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            debug: false,
          },
          global: { headers: { 'X-Client-Info': 'partyvilla-store' } },
        })
      }
    } else {
      GLOBAL_SUPABASE_INSTANCE = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          ...getAuthConfig(),
          storage: getStorageAdapter(),
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          debug: false,
        },
        global: { headers: { 'X-Client-Info': 'partyvilla-store' } },
      })
    }
  } catch (e) {
    console.error('[Supabase] Client creation failed', e)
    throw e
  }

  return GLOBAL_SUPABASE_INSTANCE
}

// Export browser client (now uses unified)
export const createBrowserClient = createUnifiedSupabaseClient

// For backward compatibility - all use the unified client
export const createGenericClient = createUnifiedSupabaseClient
export const createClient = createUnifiedSupabaseClient
export const supabase = createUnifiedSupabaseClient()
