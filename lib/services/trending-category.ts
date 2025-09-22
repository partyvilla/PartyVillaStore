import { supabase } from "@/lib/database/supabase";

/**
 * Add a "Trending" category if it doesn't exist
 */
export async function addTrendingCategory() {
  try {
    // Check if trending category exists
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", "trending")
      .single();

    // If it doesn't exist, insert it
    if (error || !data) {
      const { error: insertError } = await supabase.from("categories").insert({
        name: "Trending",
        slug: "trending",
        description: "Our most popular products right now",
        image: "/trending-products.png",
      });
    }
  } catch (error) {}
}
