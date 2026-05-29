"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CartButton } from "../cart/cart-button"
import { Menu, Search, X } from "lucide-react"
import { useState } from "react"
import { UserNav } from "../auth/user-nav"
import { SearchSuggestions } from "../search/search-suggestions"
import { useAuth } from "@/lib/auth/auth-provider"

// Mobile Menu Component
function MobileMenu({ onAuthPage, onClose }: { onAuthPage: boolean; onClose: () => void }) {
  const { user, isLoading, isAdmin, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    onClose()
    window.location.reload()
  }

  return (
    <div className="border-t border-border bg-white md:hidden">
      <nav className="flex flex-col py-2">
        {isLoading ? (
          <div className="px-4 py-3 text-center text-foreground/50">Loading...</div>
        ) : user ? (
          // Logged in user menu
          <>
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-3 hover:bg-muted/40 flex items-center gap-3 border-b border-border"
                onClick={onClose}
              >
                <div className="w-6 h-6 flex items-center justify-center text-primary">⚙️</div>
                <span className="text-foreground">Dashboard</span>
              </Link>
            )}
            <Link
              href="/orders"
              className="px-4 py-3 hover:bg-muted/40 flex items-center gap-3 border-b border-border"
              onClick={onClose}
            >
              <div className="w-6 h-6 flex items-center justify-center text-primary">📦</div>
              <span className="text-foreground">My Orders</span>
            </Link>
            <Link
              href="/address"
              className="px-4 py-3 hover:bg-muted/40 flex items-center gap-3 border-b border-border"
              onClick={onClose}
            >
              <div className="w-6 h-6 flex items-center justify-center text-primary">📍</div>
              <span className="text-foreground">My Address</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-3 hover:bg-muted/40 flex items-center gap-3 text-left w-full"
            >
              <div className="w-6 h-6 flex items-center justify-center text-primary">👋</div>
              <span className="text-foreground">Sign Out</span>
            </button>
          </>
        ) : (
          // Not logged in menu
          !onAuthPage && (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-3 hover:bg-muted/40 flex items-center gap-3 border-b border-border"
                onClick={onClose}
              >
                <div className="w-6 h-6 flex items-center justify-center text-primary">🔑</div>
                <span className="text-foreground">Sign In</span>
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-3 hover:bg-muted/40 flex items-center gap-3"
                onClick={onClose}
              >
                <div className="w-6 h-6 flex items-center justify-center text-primary">👤</div>
                <span className="text-foreground">Sign Up</span>
              </Link>
            </>
          )
        )}
      </nav>
    </div>
  )
}

export function SiteHeader() {
  const pathname = usePathname()
  const onAuthPage = pathname?.startsWith("/auth")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [locationPrompt, setLocationPrompt] = useState("Enter Location to check availability")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      {/* Main header with shadow for depth */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 md:gap-4 md:py-4">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden flex items-center justify-center p-1 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-primary" />
              ) : (
                <Menu className="h-5 w-5 text-primary" />
              )}
            </button>
            
            {/* Enhanced Brand with subtle design elements */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-1" prefetch={true}>
                <div className="relative">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap text-primary leading-none">
                    PartyVilla
                  </span>
                  <span className="text-[10px] sm:text-xs text-primary/70 leading-none">
                    Celebrations Perfected
                  </span>
                </div>
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </div>

          {/* Enhanced Desktop Search with better styling */}
          <div className="hidden md:flex w-full max-w-lg items-center mx-4">
            <SearchSuggestions placeholder="Search for balloons, decorations, gifts..." />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button 
              className="p-1 md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label={isSearchOpen ? "Close search" : "Open search"}
            >
              <Search className="h-5 w-5 text-primary" />
            </button>
            
            {!onAuthPage && <UserNav />}
            <CartButton />
          </div>
        </div>
      </div>
      
      {/* Mobile Search - Expandable */}
      {isSearchOpen && (
        <div className="px-4 py-3 border-t border-border bg-white md:hidden">
          <SearchSuggestions 
            placeholder="Search products..." 
            isMobile={true}
            onSubmit={() => setIsSearchOpen(false)}
          />
        </div>
      )}
      
      {/* Mobile Menu - Expandable */}
      {isMobileMenuOpen && (
        <MobileMenu 
          onAuthPage={onAuthPage} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </header>
  )
}
