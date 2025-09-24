'use client'

import { ProtectedRoute } from "@/components/auth/protected-route"

interface AdminWrapperProps {
  children: React.ReactNode
}

export function AdminWrapper({ children }: AdminWrapperProps) {
  return (
    <ProtectedRoute adminOnly={true}>
      {children}
    </ProtectedRoute>
  )
}