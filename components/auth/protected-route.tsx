'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  fallback = <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      if (adminOnly && !isAdmin) {
        router.push('/')
        return
      }
    }
  }, [user, isLoading, isAdmin, adminOnly, router])

  if (isLoading) {
    return <>{fallback}</>
  }

  if (!user) {
    return null // Redirect is handled in useEffect
  }

  if (adminOnly && !isAdmin) {
    return null // Redirect is handled in useEffect
  }

  return <>{children}</>
}