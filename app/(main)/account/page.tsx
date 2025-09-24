"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useRouter } from "next/navigation"
import Link from "next/link"

function AccountPageContent() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-3">
              <Button 
                variant={"ghost"} 
                onClick={() => router.push('/orders')}
                className="flex items-center justify-start w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors cursor-pointer"
              >
                <span>My Orders</span>
                <span className="text-gray-400">→</span>
              </Button>
              <Button 
                variant={"ghost"} 
                onClick={() => router.push('/address')}
                className="flex items-center justify-start w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors cursor-pointer"
              >
                <span>My Address</span>
                <span className="text-gray-400">→</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Actions</h3>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountPageContent />
    </ProtectedRoute>
  )
}
