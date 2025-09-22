'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/database/supabase'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    // Initial session check
    refreshSession()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED') => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await refreshSession()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setIsAdmin(false)
        }
      }
    )
    
    return () => {
      subscription.unsubscribe()
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
