import Link from "next/link"
import { CartClient } from "@/components/cart/cart-client"

export default function CartPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:space-y-8 md:py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            Cart
          </li>
        </ol>
      </nav>

      <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Your Cart</h1>
      <CartClient />
    </main>
  )
}
