'use client'

import { createBrowserClient } from '@/lib/database/supabase'

// Simple module-level cache (singleton)
let globalSupabaseInstance: any = null
let instanceCreated = false

export function useSupabase() {
  if (globalSupabaseInstance && instanceCreated) return globalSupabaseInstance
  if (!instanceCreated) {
    globalSupabaseInstance = createBrowserClient()
    instanceCreated = true
  }
  return globalSupabaseInstance
}

// Function to reset the global instance (useful for testing or auth state reset)
export function resetSupabaseInstance() {
  globalSupabaseInstance = null
  instanceCreated = false
}