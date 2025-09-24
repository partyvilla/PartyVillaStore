export interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export const getStorageAdapter = (): StorageAdapter => {
  if (typeof window === 'undefined') {
    // Server-side: return null storage
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }
  
  // Client-side: use localStorage with fallback
  return {
    getItem: (key: string) => {
      try {
        return localStorage.getItem(key)
      } catch (error) {
        return null
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value)
      } catch (error) {
        // Silently fail in private browsing mode
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        // Silently fail
      }
    }
  }
}

// Get environment-specific auth configuration
export const getAuthConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  
  return {
    storage: getStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    storageKey: `partyvilla-auth-${isProduction ? 'prod' : 'dev'}`,
    debug: !isProduction
  }
}