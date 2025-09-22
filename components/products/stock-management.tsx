'use client'

import { formatCurrency } from '@/lib/utils/currency'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Pencil, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  stock: number
  price: number
  variants?: Array<{ name: string; stock?: number }> | null
  created_at: string
  updated_at: string
}

export function StockManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editingVariant, setEditingVariant] = useState<{productId: string, variantIndex: number} | null>(null)
  const [editStock, setEditStock] = useState<string>('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  // For products with variants, edit the first variant's stock; otherwise, fallback to product-level stock
  const handleEditStock = (product: Product) => {
    setEditingProduct(product.id)
    if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
      setEditStock(product.variants[0].stock?.toString() || '0')
    } else {
      setEditStock('0')
    }
  }

  const handleSaveStock = async (productId: string) => {
    try {
      const newStock = parseInt(editStock)
      if (isNaN(newStock) || newStock < 0) {
        toast.error('Please enter a valid stock quantity')
        return
      }

      // Fetch the product to get its variants
      const product = products.find(p => p.id === productId)
      let updatedVariants = product?.variants ? [...product.variants] : []
      if (updatedVariants.length > 0) {
        updatedVariants[0].stock = newStock
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variants: updatedVariants
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update stock')
      }

      const updatedProduct = await response.json()
  setEditingProduct(null)
  toast.success('Stock updated successfully')
  fetchProducts()
    } catch (error) {
      toast.error('Failed to update stock')
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setEditingVariant(null)
    setEditStock('')
  }

  // Helper function to check if product has variants with stock
  const hasVariantsWithStock = (product: Product): boolean => {
    return Array.isArray(product.variants) && product.variants.length > 0 && product.variants.some(v => v.name && v.name.trim().length > 0)
  }

  // Handle editing variant stock
  const handleEditVariantStock = (productId: string, variantIndex: number, currentStock: number) => {
    setEditingVariant({ productId, variantIndex })
    setEditStock(currentStock.toString())
  }

  // Save variant stock
  const handleSaveVariantStock = async (productId: string, variantIndex: number) => {
    try {
      const newStock = parseInt(editStock)
      if (isNaN(newStock) || newStock < 0) {
        toast.error('Please enter a valid stock quantity')
        return
      }

      // Get current product and update the specific variant's stock
      const product = products.find(p => p.id === productId)
      let updatedVariants = product?.variants ? [...product.variants] : []
      if (updatedVariants[variantIndex]) {
        updatedVariants[variantIndex].stock = newStock
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variants: updatedVariants
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update variant stock')
      }

      const updatedProduct = await response.json()
  setEditingVariant(null)
  toast.success('Variant stock updated successfully')
  fetchProducts()
    } catch (error) {
      toast.error('Failed to update variant stock')
    }
  }

  // Calculate total stock for products with variants
  const getTotalStock = (product: Product): number => {
    if (hasVariantsWithStock(product)) {
      return product.variants!.reduce((total, variant) => total + (variant.stock || 0), 0)
    }
    return 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading stock data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">Manage product inventory levels</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:gap-4">
        {products.map((product) => {
          const totalStock = getTotalStock(product)
          const isEditing = editingProduct === product.id
          const hasVariants = hasVariantsWithStock(product)

          return (
            <Card key={product.id} className="transition-all duration-200 hover:shadow-md h-max p-0">
              <CardContent className="p-3 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                      <h3 className="font-semibold text-base md:text-lg truncate capitalize">{product.name}</h3>
                      <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        {hasVariants && (
                          <Badge variant="secondary" className="text-xs">
                            {product.variants?.length} variants
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <span>Updated: {new Date(product.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                      </div>
                      
                      {!hasVariants ? (
                        // Product-level stock management
                        <div className="text-lg sm:text-2xl font-bold">
                          {isEditing ? (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Input
                                type="number"
                                min="0"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-16 sm:w-20 h-6 sm:h-8 text-center text-sm"
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSaveStock(product.id)}
                                  className="h-6 sm:h-8 px-1 sm:px-2 text-xs"
                                >
                                  Save
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={handleCancelEdit}
                                  className="h-6 sm:h-8 px-1 sm:px-2 text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                              <span>{product.stock}</span>
                              {product.stock === 0 && (
                                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditStock(product)}
                              >
                                <Pencil className="h-2 sm:h-3 w-2 sm:w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Variant-level stock display
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                            Total: {totalStock}
                            {totalStock === 0 && (
                              <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Variants section */}
                {hasVariants && (
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                    <div className="grid gap-1 sm:gap-2">
                      {product.variants?.map((variant, index) => {
                        if (!variant.name.trim()) return null
                        
                        const isEditingThisVariant = editingVariant?.productId === product.id && editingVariant?.variantIndex === index
                        const variantStock = variant.stock || 0
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                              <span className="font-medium text-sm sm:text-base truncate">{variant.name}</span>
                              {variantStock === 0 && (
                                <Badge variant="destructive" className="text-xs flex-shrink-0">Out of Stock</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              {isEditingThisVariant ? (
                                <> 
                                  <Input
                                    type="number"
                                    min="0"
                                    value={editStock}
                                    onChange={(e) => setEditStock(e.target.value)}
                                    className="w-12 sm:w-16 h-5 sm:h-6 text-center text-xs sm:text-sm"
                                    autoFocus
                                  />
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleSaveVariantStock(product.id, index)}
                                    className="h-5 sm:h-6 px-1 sm:px-2 text-xs"
                                  >
                                    Save
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={handleCancelEdit}
                                    className="h-5 sm:h-6 px-1 sm:px-2 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <> 
                                  <span className="font-medium text-sm sm:text-base">{variantStock}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditVariantStock(product.id, index, variantStock)}
                                    className="h-5 sm:h-6 w-5 sm:w-6 p-0"
                                  >
                                    <Pencil className="h-2 w-2" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Create some products to manage their stock levels.</p>
        </div>
      )}
    </div>
  )
}
