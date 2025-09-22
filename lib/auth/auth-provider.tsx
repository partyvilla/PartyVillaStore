'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { createBrowserClient } from '@/lib/database/supabase'
import { useRouter } from 'next/navigation'
import { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { useTabReactivation } from '@/hooks/use-tab-visibility'

type User = {
  id: string
  email: string
  role?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin emails - hardcoded for development only
// In production, this would be configured via environment variables
const ADMIN_EMAILS = ['jsc.21905@gmail.com']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()
  const subscriptionRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  const refreshSession = async () => {
    try {
      setIsLoading(true)
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setUser(null)
        setIsAdmin(false)
        return
      }
      
      // Set user data
      setUser({
        id: session.user.id,
        email: session.user.email || '',
      })
      
      // Check if user is admin based on email
      const userIsAdmin = ADMIN_EMAILS.includes(session.user.email || '')
      setIsAdmin(userIsAdmin)
      
      // Set admin role in the database if needed
      if (userIsAdmin) {
        try {
          await supabase
            .from('profiles')
            .upsert({
              id: session.user.id,
              role: 'admin'
            }, { onConflict: 'id' })
        } catch (e) {
          // Log but don't stop app flow if this fails
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const setupAuthListener = () => {
    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }

    // Set up new auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await refreshSession()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
        }
      }
    )
    
    subscriptionRef.current = subscription
    return subscription
  }

  const reinitializeAuth = async () => {
    
    try {
      // First check if we can get current session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        // If there's an error, try to refresh the session
        await supabase.auth.refreshSession()
      }
      
      // Refresh our local session state
      await refreshSession()
      
      // Re-setup auth listener with a small delay to ensure clean state
      setTimeout(() => {
        setupAuthListener()
      }, 150)
    } catch (error) {
      // If everything fails, try one more session refresh
      try {
        await refreshSession()
      } catch (e) {
      }
    }
  }

  // Handle tab reactivation with high priority (auth should go first)
  useTabReactivation(reinitializeAuth, [], 'high')

  useEffect(() => {
    // Initial session check and setup
    if (!isInitializedRef.current) {
      refreshSession()
      setupAuthListener()
      isInitializedRef.current = true
    }
    
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      
      if (error) throw error
      
      await refreshSession()
      router.refresh()
    } catch (error: any) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
      router.refresh()
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        signIn,
        signOut,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
