"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CategoryImageUpload } from "@/components/categories/category-image-upload"
import { Category, CategoryInsert, CategoryUpdate, createCategory, updateCategory } from "@/lib/database/services/supabase-categories"
import { useCustomToast } from "@/hooks/use-custom-toast"

interface CategoryFormProps {
  category?: Category | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CategoryForm({ category, open, onOpenChange, onSuccess }: CategoryFormProps) {
  const { showToast } = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CategoryInsert>({
    name: category?.name || "",
    slug: category?.slug || "",
    image: "",
    description: category?.description || "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const isEditing = !!category

  // Reset form when category changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        name: category?.name || "",
        slug: category?.slug || "",
        image: "",
        description: category?.description || "",
      })
      setImageFile(null)
    }
  }, [category, open])

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'party-villa-categories')

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || errorData.details || 'Failed to upload image')
    }

    const result = await response.json()
    return result.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalFormData = { ...formData }

      // Upload image if a file is selected
      if (imageFile) {
        try {
          const uploadedImageUrl = await uploadImageToCloudinary(imageFile)
          finalFormData.image = uploadedImageUrl
        } catch (uploadError) {
          showToast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          })
          return
        }
      } else if (isEditing && category?.image) {
        // Preserve existing image URL when editing and no new file is selected
        finalFormData.image = category.image
      }

      let result
      if (isEditing) {
        result = await updateCategory(category.id, finalFormData as CategoryUpdate)
      } else {
        result = await createCategory(finalFormData)
      }

      if (result.error) {
        showToast({
          title: "Error",
          description: result.error,
          variant: "destructive"
        })
        return
      }

      showToast({
        title: "Success",
        description: `Category ${isEditing ? "updated" : "created"} successfully`,
      })

      onSuccess()
      onOpenChange(false)
      
      // Reset form for new entries
      if (!isEditing) {
        setFormData({
          name: "",
          slug: "",
          image: "",
          description: "",
        })
        setImageFile(null)
      }
    } catch (error) {
      showToast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      // Auto-generate slug only if it's empty or hasn't been manually edited
      slug: !formData.slug || formData.slug === generateSlug(formData.name) 
        ? generateSlug(value) 
        : prev.slug
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the category details below." 
              : "Fill in the details to create a new category."
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Birthday Supplies"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g., birthday-supplies"
              pattern="[a-z0-9\-]+"
              title="Only lowercase letters, numbers, and hyphens allowed"
              required
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs. Only lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <CategoryImageUpload
              value={imageFile || undefined}
              onChange={(file: File | null) => {
                setImageFile(file)
              }}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : (isEditing ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
