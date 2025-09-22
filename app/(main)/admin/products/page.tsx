import { getProducts } from "@/lib/database/services/supabase-products"
import { ProductList } from "@/components/admin/management/product-list"

export default async function AdminProductsPage() {
  // Fetch products from the database
  const products = await getProducts()

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your catalog including variants and pricing.</p>
      </header>

      <ProductList initialProducts={products} />
    </main>
  )
}
