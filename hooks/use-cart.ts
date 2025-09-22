"use client";

import { useEffect, useCallback } from "react";
import useSWR from "swr";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTabReactivation, useGlobalReactivation } from "./use-tab-visibility";

export type CartItem = {
  id: string; // product_id
  name: string;
  price: number;
  qty: number;
  img?: string;
  variant?: string;
  stock?: number; // Available stock for this product/variant
};

const supabase = createClientComponentClient();

// Helper to get current user
async function getUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id || null;
}

// Helper to get product stock
async function getProductStock(productId: string, variant?: string) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('variants')
      .eq('id', productId)
      .single();

    if (error || !product) {
      return 0;
    }


    // Stock is only stored in variants, not at product level
    if (product.variants && Array.isArray(product.variants)) {
      // If variant is specified, find the specific variant
      if (variant) {
        const variantData = product.variants.find((v: any) => 
          v.name === variant || v.id === variant || v.variant === variant
        );
        if (variantData && typeof variantData.stock === 'number') {
          return variantData.stock;
        }
        // If variant specified but not found, return 0
        return 0;
      } else {
        // If no variant specified, return stock from first variant or 0
        const firstVariant = product.variants[0];
        if (firstVariant && typeof firstVariant.stock === 'number') {
          return firstVariant.stock;
        }
      }
    }

    // If no variants or no stock info found, return 0
    return 0;
  } catch (error) {
    return 0;
  }
}

// Fetch cart items for current user
async function fetchCart() {
  const user_id = await getUserId();
  if (!user_id) return [];
  const { data, error } = await supabase
    .from("cart")
    .select("product_id, name, price, qty, img, variant")
    .eq("user_id", user_id);
  if (!data) return [];
  
  // Map product_id to id and fetch stock for each item
  const cartItemsWithStock = await Promise.all(
    data.map(async (item: any) => {
      const stock = await getProductStock(item.product_id, item.variant);
      return {
        id: item.product_id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        img: item.img,
        variant: item.variant,
        stock: stock,
      };
    })
  );
  
  return cartItemsWithStock;
}

export function useCart() {
  const { data, mutate } = useSWR<CartItem[]>("cart-items", fetchCart, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  // Handle tab reactivation - refresh cart data with medium priority
  useTabReactivation(async () => {
    await mutate()
  }, [], 'medium')

  const items = data ?? [];
  const count = items.reduce((n: number, it: CartItem) => n + (it.qty || 0), 0);
  const subtotal = items.reduce(
    (s: number, it: CartItem) => s + it.price * it.qty,
    0
  );

  // Add or update item in cart
  async function addItem(newItem: Omit<CartItem, "qty" | "stock">, qty = 1) {
    const user_id = await getUserId();
    if (!user_id) return;

    // Check available stock before adding
    const availableStock = await getProductStock(newItem.id, newItem.variant);
    
    // Check if item exists to get current quantity
    let query = supabase
      .from("cart")
      .select("id, qty")
      .eq("user_id", user_id)
      .eq("product_id", newItem.id);
    if (newItem.variant) {
      query = query.eq("variant", newItem.variant);
    } else {
      query = query.is("variant", null);
    }
    const { data: existing } = await query.single();
    
    const currentQty = existing ? existing.qty : 0;
    const newTotalQty = currentQty + qty;
    
    // Check if new total quantity would exceed available stock
    if (newTotalQty > availableStock) {
      throw new Error(`Only ${availableStock} items available in stock. You currently have ${currentQty} in your cart.`);
    }

    if (existing) {
      // Update qty
      await supabase
        .from("cart")
        .update({ qty: newTotalQty })
        .eq("id", existing.id);
    } else {
      // Insert new
      await supabase.from("cart").insert({
        user_id,
        product_id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        qty,
        img: newItem.img,
        variant: newItem.variant || null,
      });
    }
    mutate();
  }

  // Remove item
  async function removeItem(id: string, variant?: string) {
    const user_id = await getUserId();
    if (!user_id) {
      return;
    }
        
    try {
      // First, let's check if the item exists
      let checkQuery = supabase
        .from("cart")
        .select("*")
        .eq("user_id", user_id)
        .eq("product_id", id);
        
      if (variant) {
        checkQuery = checkQuery.eq("variant", variant);
      } else {
        checkQuery = checkQuery.is("variant", null);
      }
      
      const { data: existingItems, error: checkError } = await checkQuery;
      
      // Now delete the item
      let query = supabase
        .from("cart")
        .delete()
        .eq("user_id", user_id)
        .eq("product_id", id);
      
      if (variant) {
        query = query.eq("variant", variant);
      } else {
        query = query.is("variant", null);
      }
      
      const { error, data } = await query;
      
      if (error) {
        throw new Error("Failed to remove item from cart");
      }
      
      mutate();
    } catch (error) {
      throw error;
    }
  }

  // Set quantity
  async function setQuantity(id: string, qty: number, variant?: string) {
    const user_id = await getUserId();
    if (!user_id) return;

    try {
      // Check available stock before updating
      const availableStock = await getProductStock(id, variant);
      
      // If stock is 0 or less, don't allow any quantity
      if (availableStock <= 0) {
        throw new Error(`This item is currently out of stock.`);
      }
      
      if (qty > availableStock) {
        throw new Error(`Only ${availableStock} items available in stock.`);
      }

      // First, optimistically update the local state
      mutate(
        (current) =>
          current?.map((item) =>
            item.id === id && item.variant === variant ? { ...item, qty, stock: availableStock } : item
          ) ?? [],
        false
      );

      // Find the existing cart item
      let query = supabase
        .from("cart")
        .select("id")
        .eq("user_id", user_id)
        .eq("product_id", id);

      if (variant) {
        query = query.eq("variant", variant);
      } else {
        query = query.is("variant", null);
      }

      const { data: existing, error: selectError } = await query.single();

      if (selectError) {
        // Revert optimistic update
        mutate();
        return;
      }

      if (existing) {
        // Update the existing item's quantity
        const { error: updateError } = await supabase
          .from("cart")
          .update({ qty })
          .eq("id", existing.id);

        if (updateError) {
          // Revert optimistic update
          mutate();
          return;
        }
      }

      // Revalidate from server to ensure consistency
      mutate();
    } catch (error) {
      // Revert optimistic update
      mutate();
      throw error; // Re-throw to let the component handle the error
    }
  }

  // Clear cart
  async function clear() {
    const user_id = await getUserId();
    if (!user_id) return;
    await supabase.from("cart").delete().eq("user_id", user_id);
    mutate();
  }

  // Get cart quantity for a product/variant
  const getCartQty = useCallback(
    async (product_id: string, variant?: string) => {
      const user_id = await getUserId();
      if (!user_id) return 0;
      let query = supabase
        .from("cart")
        .select("qty")
        .eq("user_id", user_id)
        .eq("product_id", product_id);
      if (variant) {
        query = query.eq("variant", variant);
      } else {
        query = query.is("variant", null);
      }
      const { data } = await query.maybeSingle();
      return data?.qty || 0;
    },
    []
  );

  // Refresh cart data (useful when stock levels might have changed)
  const refreshCart = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    setQuantity,
    clear,
    getCartQty,
    refreshCart,
  };
}
