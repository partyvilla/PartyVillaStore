import { supabase } from '@/lib/database/supabase'
import { createServerClient } from '@/lib/database/supabase-server'
import type { Database } from '@/lib/database/database.types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type { Order }

export type OrderStatus = "pending" | "confirmed" | "delivered"

export async function getOrders(limit = 5, supabaseClient?: any) {
  // Use provided client or server-side client for server components
  const client = supabaseClient || await createServerClient()
  
  const { data: orders, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return []
  }

  if (!orders || orders.length === 0) {
    return []
  }

  // Get user profiles for each order
  const userIds = [...new Set(orders.map((order: Order) => order.user_id))]
  const { data: profiles } = await client
    .from('profiles')
    .select('user_id, name, phone')
    .in('user_id', userIds)

  // Merge orders with profile data
  const ordersWithProfiles = orders.map((order: Order) => ({
    ...order,
    profiles: profiles?.find((profile: any) => profile.user_id === order.user_id) || null
  }))

  return ordersWithProfiles
}

export async function getOrderById(id: string, supabaseClient?: any) {
  const client = supabaseClient || await createServerClient()
  
  const { data, error } = await client
    .from('orders')
    .select('*')
    .eq('id', id) // ID is now uuid
    .single()

  if (error) {
    return null
  }

  return data
}

export async function createOrder(order: OrderInsert, supabaseClient?: any) {
  const client = supabaseClient || supabase
  
  const { data: orderData, error: orderError } = await client
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (orderError) {
    throw orderError
  }

  return orderData
}

export async function updateOrderStatus(id: string, status: OrderStatus, supabaseClient = supabase) {
  
  // Perform the update directly (order existence already verified in API route)
  const { data, error } = await supabaseClient
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()

  if (error) {
    throw error
  }

  if (!data || data.length === 0) {
    throw new Error(`Order with ID ${id} could not be updated - no rows affected`)
  }

  return data[0]
}

export async function getOrdersByUser(userId: string, supabaseClient?: any) {
  const client = supabaseClient || await createServerClient()
  
  const { data: orders, error } = await client
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  if (!orders || orders.length === 0) {
    return []
  }

  // Get user profile
  const { data: profile } = await client
    .from('profiles')
    .select('user_id, name, phone')
    .eq('user_id', userId)
    .single()

  // Merge orders with profile data
  const ordersWithProfile = orders.map((order: Order) => ({
    ...order,
    profiles: profile
  }))

  return ordersWithProfile
}

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "confirmed":
      return "bg-blue-100 text-blue-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
