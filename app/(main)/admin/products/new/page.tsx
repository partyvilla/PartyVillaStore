import { ProductForm } from '@/components/admin/forms/product-form'

export default function CreateProductPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
      <ProductForm />
    </div>
  )
}
