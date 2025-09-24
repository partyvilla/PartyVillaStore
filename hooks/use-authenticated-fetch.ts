'use client'

import { useAuth } from '@/lib/auth/auth-provider'

export function useAuthenticatedFetch() {
  const { refreshSession } = useAuth()

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    try {
      // First attempt
      let response = await fetch(url, options)
      
      // If 401 Unauthorized, try to refresh session and retry
      if (response.status === 401) {
        console.log('Got 401, attempting session refresh...')
        await refreshSession()
        
        // Retry the request
        response = await fetch(url, options)
      }
      
      return response
    } catch (error) {
      console.error('Authenticated fetch failed:', error)
      throw error
    }
  }

  return { fetchWithAuth }
}