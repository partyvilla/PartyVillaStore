import { supabase } from "@/lib/database/supabase";

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CategoryInsert = {
  id?: number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
};

export type CategoryUpdate = {
  name?: string;
  slug?: string;
  image?: string | null;
  description?: string | null;
};

/**
 * Get all categories from the database
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    return [];
  }

  return (data as Category[]) || [];
}

/**
 * Get limited categories for footer display
 */
export async function getCategoriesForFooter(
  limit: number = 4
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .limit(limit);

  if (error) {
    // Return empty array on error
    return [];
  }

  const categories = (data as Category[]) || [];

  return categories;
}

/**
 * Create a new category
 */
export async function createCategory(
  category: CategoryInsert
): Promise<{ data: Category | null; error: string | null }> {
  // Generate slug if not provided
  if (!category.slug) {
    category.slug = category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Check if slug already exists
  const { data: existing, error: checkError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", category.slug)
    .single();

  // Only return error if we actually found a duplicate, not if there's no match
  if (existing && !checkError) {
    return { data: null, error: "A category with this slug already exists" };
  }

  // Try to get the next available ID to avoid sequence issues
  const { data: maxIdResult } = await supabase
    .from("categories")
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .single();

  // Create the category data with explicit ID to avoid sequence issues
  const nextId = (maxIdResult?.id || 0) + 1;
  const categoryWithId = { ...category, id: nextId };

  const { data, error } = await supabase
    .from("categories")
    .insert(categoryWithId)
    .select()
    .single();

  if (error) {

    // If it's a primary key violation, try without explicit ID (let database handle it)
    if (error.code === "23505" && error.message.includes("categories_pkey")) {
      const { data: retryData, error: retryError } = await supabase
        .from("categories")
        .insert(category)
        .select()
        .single();

      if (retryError) {
        return { data: null, error: retryError.message };
      }

      return { data: retryData as Category, error: null };
    }

    return { data: null, error: error.message };
  }

  return { data: data as Category, error: null };
}

/**
 * Update an existing category
 */
export async function updateCategory(
  id: number,
  updates: CategoryUpdate
): Promise<{ data: Category | null; error: string | null }> {
  // If updating slug, check if it already exists
  if (updates.slug) {
    const { data: existing } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", updates.slug)
      .neq("id", id)
      .single();

    if (existing) {
      return { data: null, error: "A category with this slug already exists" };
    }
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as Category, error: null };
}

/**
 * Delete a category
 */
export async function deleteCategory(
  id: number
): Promise<{ success: boolean; error: string | null }> {
  // First get the category to find its slug
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .single();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  // Check if category has products (products reference categories by slug)
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("category", category.slug)
    .limit(1);

  if (products && products.length > 0) {
    return {
      success: false,
      error:
        "Cannot delete category that has products. Please move or delete the products first.",
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Get category product count
 */
export async function getCategoryProductCount(
  categorySlug: string
): Promise<number> {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category", categorySlug);

  if (error) {
    return 0;
  }

  return count || 0;
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string) {
  // Only query database if not found in defaults
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    return null;
  }

  return data as Category;
}
