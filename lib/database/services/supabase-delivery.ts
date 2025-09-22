import { supabase } from '@/lib/database/supabase'

export type DeliveryAddress = {
  id: string
  pincode: string
  delivery_charge: number
  created_at: string
  updated_at: string
}

export type DeliveryAddressInsert = {
  id?: string
  pincode: string
  delivery_charge: number
}

export type DeliveryAddressUpdate = {
  pincode?: string
  delivery_charge?: number
}

/**
 * Get all delivery addresses from the database
 */
export async function getDeliveryAddresses(): Promise<DeliveryAddress[]> {
  const { data, error } = await supabase
    .from('delivery_address')
    .select('*')
    .order('pincode')
  
  if (error) {
    return []
  }
  
  return data || []
}

/**
 * Get delivery address by ID
 */
export async function getDeliveryAddressById(id: string): Promise<DeliveryAddress | null> {
  const { data, error } = await supabase
    .from('delivery_address')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

/**
 * Get delivery address by pincode
 */
export async function getDeliveryAddressByPincode(pincode: string): Promise<DeliveryAddress | null> {
  const { data, error } = await supabase
    .from('delivery_address')
    .select('*')
    .eq('pincode', pincode)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    return null
  }
  
  return data
}

/**
 * Create a new delivery address
 */
export async function createDeliveryAddress(deliveryAddress: DeliveryAddressInsert): Promise<DeliveryAddress | null> {
  const { data, error } = await supabase
    .from('delivery_address')
    .insert(deliveryAddress)
    .select()
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

/**
 * Update delivery address
 */
export async function updateDeliveryAddress(id: string, updates: DeliveryAddressUpdate): Promise<DeliveryAddress | null> {
  const { data, error } = await supabase
    .from('delivery_address')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

/**
 * Delete delivery address
 */
export async function deleteDeliveryAddress(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('delivery_address')
    .delete()
    .eq('id', id)
  
  if (error) {
    return false
  }
  
  return true
}

/**
 * Check if pincode exists (excluding specific ID for updates)
 */
export async function isPincodeExists(pincode: string, excludeId?: string): Promise<boolean> {
  let query = supabase
    .from('delivery_address')
    .select('id')
    .eq('pincode', pincode)
  
  if (excludeId) {
    query = query.neq('id', excludeId)
  }
  
  const { data, error } = await query.limit(1)
  
  if (error) {
    return false
  }
  
  return (data?.length || 0) > 0
}