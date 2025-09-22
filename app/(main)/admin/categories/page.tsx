import { CategoryManagement } from "@/components/admin/management/category-management"

export default function AdminCategoriesPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Categories</h1>
        <p className="text-sm text-muted-foreground">Manage product categories with full CRUD operations.</p>
      </header>

      <CategoryManagement />
    </main>
  )
}
