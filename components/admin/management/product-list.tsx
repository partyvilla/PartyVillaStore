"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/currency'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { ProductForm } from '../forms/product-form'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'
import { Product } from '@/lib/database/services/supabase-products'

interface ProductListProps {
  initialProducts: Product[]
}

export function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useCustomToast()

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      
      if (response.ok) {
        setProducts(Array.isArray(data) ? data : [])
      } else {
        throw new Error(data.error || 'Failed to fetch products')
      }
    } catch (error) {
        showToast({
          title: 'Error',
          description: 'Failed to fetch products',
          variant: 'destructive',
        })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        showToast({
          title: 'Success',
          description: 'Product deleted successfully',
        })
        fetchProducts()
      } else {
        throw new Error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete product',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  // Transform database Product to ProductForm expected format
  const transformProductForForm = (product: Product | null) => {
    if (!product) return undefined
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description || undefined,
      image_url: Array.isArray(product.image_url)
        ? product.image_url
        : (typeof product.image_url === 'string' && product.image_url)
          ? [product.image_url]
          : [],
      variants: Array.isArray(product.variants)
        ? product.variants
        : (typeof product.variants === 'string' && product.variants)
          ? JSON.parse(product.variants)
          : [],
    }
  }

  if (showForm) {
    return (
      <ProductForm
        product={transformProductForForm(editingProduct)}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Button onClick={handleAddNew} className="bg-primary text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Products ({products?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-sm text-muted-foreground">Loading products...</div>
            </div>
          ) : (products?.length || 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-sm text-muted-foreground mb-4">No products found</div>
              <Button onClick={handleAddNew} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {Array.isArray(product.image_url) && product.image_url.length > 0 && product.image_url[0] && product.image_url[0].trim() !== '' ? (
                        <img
                          src={product.image_url[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="capitalize">
                      {product.category?.replace("-", " ") || "Uncategorized"}
                    </TableCell>
                    <TableCell>
                      {Array.isArray(product.variants)
                        ? product.variants.length
                        : (typeof product.variants === 'string' && product.variants)
                          ? (() => { try { return JSON.parse(product.variants).length } catch { return 0 } })()
                          : 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/product/${product.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id.toString())}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
