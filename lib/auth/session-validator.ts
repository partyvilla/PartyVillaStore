import type { SupabaseClient, Session } from '@supabase/supabase-js'

export interface SessionValidationResult {
  valid: boolean
  session: Session | null
  needsRefresh?: boolean
}

export const validateSession = async (supabase: SupabaseClient): Promise<SessionValidationResult> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      if (process.env.NODE_ENV !== 'production') console.warn('[Auth] getSession error', error)
      return { valid: false, session: null }
    }
    
    if (!session) {
      return { valid: false, session: null }
    }
    
    // Check if token is expired or will expire soon (within 5 minutes)
    const now = Math.floor(Date.now() / 1000)
    const expiresAt = session.expires_at || 0
    const fiveMinutesFromNow = now + (5 * 60)
    
    if (expiresAt < now) {
      // Token is expired, try to refresh
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
      
      if (refreshError || !refreshData.session) {
        if (process.env.NODE_ENV !== 'production') console.warn('[Auth] refreshSession failed', refreshError)
        return { valid: false, session: null }
      }
      
      return { valid: true, session: refreshData.session, needsRefresh: true }
    }
    
    if (expiresAt < fiveMinutesFromNow) {
      // Token will expire soon, but still valid
      return { valid: true, session, needsRefresh: true }
    }
    
    // Token is valid and not expiring soon
    return { valid: true, session }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('[Auth] validateSession exception', error)
    return { valid: false, session: null }
  }
}

// Check if we have any stored session data
export const hasStoredSession = (storageKey: string): boolean => {
  if (typeof window === 'undefined') return false
  
  try {
    const stored = localStorage.getItem(storageKey)
    return !!stored
  } catch {
    return false
  }
}

// Clear all session data
export const clearSessionStorage = (storageKey: string): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(storageKey)
    // Also clear any other auth-related keys
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.includes('supabase') || key?.includes('auth')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
  } catch (error) {
    // Silent fail
  }
}