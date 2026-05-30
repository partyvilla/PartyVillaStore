import Link from "next/link"
import { CheckoutClient } from "@/components/checkout/checkout-client"
import { ChevronRight } from "lucide-react"

export default function CheckoutPage() {
  return (
    <main>
      {/* Header */}
      <div className="bg-muted/50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-foreground/60 hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <Link href="/cart" className="text-foreground/60 hover:text-primary transition-colors">Cart</Link>
            <ChevronRight className="w-4 h-4 text-foreground/40" />
            <span className="text-foreground font-semibold">Checkout</span>
          </nav>
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <CheckoutClient />
      </div>
    </main>
  )
}
