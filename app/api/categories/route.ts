import { NextRequest, NextResponse } from "next/server"
import { getCategories, createCategory, updateCategory, deleteCategory, CategoryInsert, CategoryUpdate } from "@/lib/database/services/supabase-categories"

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CategoryInsert
    
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const result = await createCategory(body)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }
    
    const body = await request.json() as CategoryUpdate
    const result = await updateCategory(parseInt(id), body)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json(result.data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 })
    }
    
    const result = await deleteCategory(parseInt(id))
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
