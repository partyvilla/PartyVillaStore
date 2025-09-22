"use client"

import { User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"

export function UserNav() {
  const { user, isLoading, isAdmin, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-gray-700 hover:bg-gray-100 hover:text-primary"
          >
            <Link href="/admin">
              Dashboard
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="hidden sm:inline-flex text-gray-700 hover:bg-gray-100 hover:text-primary"
        >
          Sign out
        </Button>
        {!isAdmin && <Button
          asChild
          variant="ghost"
          size="icon"
          className="p-2"
        >
          <Link href={"/account"}>
            <User className="h-5 w-5 text-primary" />
            <span className="sr-only">Account</span>
          </Link>
        </Button>}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex text-gray-700 hover:bg-gray-100 hover:text-primary"
      >
        <Link href="/auth/login">
          Sign in
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex text-gray-700 hover:bg-gray-100 hover:text-primary"
      >
        <Link href="/auth/signup">
          Sign up
        </Link>
      </Button>
    </div>
  )
}
