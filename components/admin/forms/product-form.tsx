"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { Loader2, Plus, X, Upload } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  image?: string
  description?: string
}

interface ProductFormProps {
  product?: {
    id: string
    name: string
    category: string
    description?: string
    image_url?: string[]
    variants?: Array<{ name: string; stock?: number }>
  }
  onSuccess?: () => void
  onCancel?: () => void
}

interface Variant {
  name: string
  price?: number | string
  stock?: number | string
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {

  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    description: product?.description || '',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Helper function to parse variants from database
  const parseVariants = (variants: any): Variant[] => {
    if (!variants) return [{ name: '', price: '', stock: '' }]

    // If variants is a string (JSON from database), parse it
    if (typeof variants === 'string') {
      try {
        const parsed = JSON.parse(variants)
        return Array.isArray(parsed) && parsed.length > 0
          ? parsed.map(v => ({
            name: v.name,
            price: v.price || '',
            stock: v.stock || ''
          }))
          : [{ name: '', price: '', stock: '' }]
      } catch (error) {
        return [{ name: '', price: '', stock: '' }]
      }
    }

    // If variants is already an array, use it
    if (Array.isArray(variants)) {
      return variants.length > 0
        ? variants.map(v => ({
          name: v.name,
          price: v.price || '',
          stock: v.stock || ''
        }))
        : [{ name: '', price: '', stock: '' }]
    }

    // Fallback
    return [{ name: '', price: '', stock: '' }]
  }

  const [variants, setVariants] = useState<Variant[]>(
    parseVariants(product?.variants)
  )
  const [images, setImages] = useState<File[]>([])
  // Store all existing images as an array for editing
  const [existingImages, setExistingImages] = useState<string[]>(
    Array.isArray(product?.image_url) ? product.image_url : (product?.image_url ? [product.image_url] : [])
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useCustomToast()

  // Helper to check if product has meaningful variants
  const hasVariants = () => {
    return variants.some(variant => variant.name.trim().length > 0)
  }

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) { }
      finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVariantChange = (index: number, value: string) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], name: value }
    setVariants(newVariants)
  }

  const handleVariantPriceChange = (index: number, price: string) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], price }
    setVariants(newVariants)
  }

  const handleVariantStockChange = (index: number, stock: string) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], stock }
    setVariants(newVariants)
  }

  const addVariant = () => {
    setVariants([...variants, { name: '', price: '', stock: '' }])
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      // Check if we have a valid product for editing
      const isEdit = product && product.id && product.id !== 'undefined' && product.id !== 'null'
      formDataToSend.append('name', formData.name)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('description', formData.description)
      const variantArray = variants.filter(v => v.name.trim()).map(v => ({
        name: v.name,
        price: v.price === '' ? 0 : Number(v.price) || 0,
        stock: v.stock === '' ? 0 : Number(v.stock) || 0
      }))
      // For PUT, send as array, not string
      if (isEdit) {
        formDataToSend.append('variants', new Blob([JSON.stringify(variantArray)], { type: 'application/json' }))
      } else {
        formDataToSend.append('variants', JSON.stringify(variantArray))
      }
      // Send all remaining existing images as an array
      existingImages.forEach(img => formDataToSend.append('existingImage', img))

      // Send a flag to indicate if the user intentionally removed the existing image
      const userRemovedAllImages = product?.image_url && existingImages.length === 0
      formDataToSend.append('removeExistingImage', userRemovedAllImages ? 'true' : 'false')

      images.forEach(image => {
        formDataToSend.append('images', image)
      })

      const url = isEdit
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'

      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok) {
        let errorMsg = 'Failed to save product'
        if (result && result.error) {
          errorMsg = result.error
        } else if (result && typeof result === 'string') {
          errorMsg = result
        } else if (!result || Object.keys(result).length === 0) {
          errorMsg = `API Error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMsg)
      }

      showToast({
        title: 'Success',
        description: isEdit ? 'Product updated successfully' : 'Product created successfully',
      })

      onSuccess?.()
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save product',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>
          </div>

          {/* Show info when variants have stock */}
          {!product && hasVariants() && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                This product has variants. Stock is managed individually for each variant below.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={loadingCategories}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingCategories ? "Loading categories..." : "Select a category"}
              </option>
              {categories.map((category: Category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <Label>Variants</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Add variants with individual stock levels. Leave empty if product has no variants.
            </p>
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs">Variant Name</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, e.target.value)}
                      placeholder="e.g., Small, Red, 12-pack"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-24">
                    <Label className="text-xs">Price</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.price || ''}
                      onChange={(e) => handleVariantPriceChange(index, e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div className="w-24">
                    <Label className="text-xs">Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variant.stock || ''}
                      onChange={(e) => handleVariantStockChange(index, e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="h-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVariant}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </div>

          <div>
            <Label>Product Images</Label>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {existingImages.map((img, idx) => (
                    <div key={img + idx} className="relative inline-block">
                      <img
                        src={img}
                        alt={`Product ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>

              {images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">New Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {product ? 'Update Product' : 'Create Product'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

