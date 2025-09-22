"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Category, getCategories, deleteCategory, getCategoryProductCount } from "@/lib/database/services/supabase-categories"
import { CategoryForm } from "../forms/category-form"
import { useCustomToast } from "@/hooks/use-custom-toast"

interface CategoryWithCount extends Category {
  productCount: number
}

export function CategoryManagement() {
  const { showToast } = useCustomToast()
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const categoriesData = await getCategories()
      
      // Load product counts for each category
      const categoriesWithCounts = await Promise.all(
        categoriesData.map(async (category) => {
          const productCount = await getCategoryProductCount(category.slug)
          return {
            ...category,
            productCount
          }
        })
      )
      
      setCategories(categoriesWithCounts)
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete the "${category.name}" category?`)) {
      return
    }

    setDeleteLoading(category.id)
    try {
      const result = await deleteCategory(category.id)
      
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
        description: "Category deleted successfully",
      })

      loadCategories() // Reload categories
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  const handleAdd = () => {
    setSelectedCategory(null)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    loadCategories() // Reload categories after successful create/update
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading categories...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Button onClick={handleAdd} size="sm">
            + Add Category
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No categories found. Add your first category to get started.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      {category.image ? (
                        <div className="flex items-center">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-12 h-12 rounded-md object-cover border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category)}
                          disabled={deleteLoading === category.id}
                        >
                          {deleteLoading === category.id ? "..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CategoryForm
        category={selectedCategory}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}
