import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
// @ts-ignore - global CSS side-effect import
import "./globals.css"
import { SiteHeader } from "@/components/layout/site-header"
import { CategoryNav } from "@/components/categories/category-nav" 
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import LinkPrefetcher from "@/components/navigation/link-prefetcher"
import ImageOptimizer from "@/components/media/image-optimizer"
import AutoReloadOnReturn from "@/components/navigation/auto-reload-on-return"
import { AuthProvider } from "@/lib/auth/auth-provider"

export const metadata: Metadata = {
  title: "PartyVilla — Gifts & Party Supplies",
  description: "Buy balloons, decorations, gifts, candles, and more. Fast, festive, and mobile-first shopping.",
  generator: "v0.app",
}

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-sans min-h-screen flex flex-col">
        <AuthProvider>
          <div className="min-h-screen w-full relative flex flex-col">
            {/* Subtle gradient background */}
            <div
              className="fixed inset-0 z-0 bg-white"
              style={{
                backgroundImage: `
                  linear-gradient(to bottom, rgba(247, 249, 243, 0.8) 0%, rgba(255, 255, 255, 1) 100%),
                  radial-gradient(circle at top right, rgba(146, 184, 94, 0.1), transparent 60%),
                  radial-gradient(circle at bottom left, rgba(146, 184, 94, 0.15), transparent 60%)
                `,
                backgroundAttachment: 'fixed',
              }}
            />
            <div className="relative z-10 flex flex-col flex-grow">
              <SiteHeader />
              <CategoryNav />
              <div className="flex-grow">
                <Suspense fallback={null}>{children}</Suspense>
              </div>
              <Footer />
            </div>
            <Analytics />
          </div>
          {/* Place Toaster outside other divs to avoid z-index issues */}
          <Toaster />
          <LinkPrefetcher />
          <ImageOptimizer />
          <AutoReloadOnReturn />
        </AuthProvider>
      </body>
    </html>
  )
}