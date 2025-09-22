"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils/currency"
import { getStatusColor, type OrderStatus } from "@/lib/database/services/supabase-orders"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrderItem {
  id: string
  name: string
  price: number
  qty: number
  img?: string
  variant?: string
}

interface OrderDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  onStatusUpdate?: (orderId: string, newStatus: OrderStatus) => void
  order: {
    id: string
    user_id: string
    items: OrderItem[]
    total_price: number
    status: string
    delivery_address: any // This might be from the order itself
    upi_ref: string
    payee_name: string
    created_at: string
    updated_at: string
    profiles?: {
      name: string
      phone?: string
      address?: string
      city?: string
      state?: string
      pincode?: string
      role?: string
    }
  } | null
}

export function OrderDetailsDialog({ isOpen, onClose, onStatusUpdate, order }: OrderDetailsDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("")
  const [isUpdating, setIsUpdating] = useState(false)
  
  if (!order) return null

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "delivered", label: "Delivered" }
  ]

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return
    
    setIsUpdating(true)
    try {
      const response = await fetch('/api/admin/orders/update-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          newStatus: selectedStatus
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order status')
      }

      const result = await response.json()
      
      onStatusUpdate?.(order.id, selectedStatus)
      onClose()
    } catch (error) {
      // TODO: Add toast notification for error
      alert(error instanceof Error ? error.message : 'Failed to update order status')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: any, profiles?: any) => {
    // Try to get address from order's delivery_address first, then fall back to user profile
    const addressData = address || profiles
    if (!addressData) return 'No address provided'
    
    const parts = []
    
    // Handle both order delivery_address format and profile format
    if (addressData.street || addressData.address) {
      parts.push(addressData.street || addressData.address)
    }
    if (addressData.city) parts.push(addressData.city)
    if (addressData.state) parts.push(addressData.state)
    if (addressData.postal_code || addressData.pincode) {
      parts.push(addressData.postal_code || addressData.pincode)
    }
    if (addressData.country) parts.push(addressData.country)
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided'
  }

  const getAddressData = () => {
    // Priority: order delivery_address, then user profile address
    if (order.delivery_address && (
      order.delivery_address.street || 
      order.delivery_address.city || 
      order.delivery_address.state || 
      order.delivery_address.postal_code
    )) {
      return {
        source: 'delivery',
        data: order.delivery_address
      }
    } else if (order.profiles && (
      order.profiles.address || 
      order.profiles.city || 
      order.profiles.state || 
      order.profiles.pincode
    )) {
      return {
        source: 'profile',
        data: order.profiles
      }
    }
    return { source: null, data: null }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Order Details - #{order.id.substring(0, 8)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Order Status</h3>
              <div className="space-y-3">
                <Badge className={getStatusColor(order.status as OrderStatus)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                
                {/* Status Update Section */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Update Status:</label>
                  <Select value={selectedStatus} onValueChange={(value: OrderStatus) => setSelectedStatus(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          disabled={option.value === order.status}
                        >
                          {option.label}
                          {option.value === order.status && " (Current)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedStatus && selectedStatus !== order.status && (
                    <Button 
                      onClick={handleStatusUpdate}
                      disabled={isUpdating}
                      size="sm"
                      className="w-full"
                    >
                      {isUpdating ? "Updating..." : "Update Status"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Total</h3>
              <p className="text-lg font-bold">{formatCurrency(order.total_price)}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Customer Information</h3>
              <div className="space-y-1">
                <p><strong>Name:</strong> {order.profiles?.name || 'Unknown Customer'}</p>
                {order.profiles?.phone && (
                  <p><strong>Phone:</strong> {order.profiles.phone}</p>
                )}
                <p><strong>Payee Name:</strong> {order.payee_name}</p>
                {order.profiles?.role && (
                  <p><strong>Role:</strong> {order.profiles.role}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <p><strong>UPI Reference:</strong> {order.upi_ref}</p>
            </div>
          </div>

          <Separator />

          {/* Delivery Address */}
          <div>
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <div className="bg-gray-50 p-4 rounded-md space-y-3">
              {(() => {
                const { source, data } = getAddressData()
                
                if (!data) {
                  return <p className="text-gray-500">No delivery address provided</p>
                }
                
                return (
                  <>
                    {/* Complete Address */}
                    <div>
                      <p><strong>Complete Address:</strong></p>
                      <p className="text-sm mt-1 leading-relaxed">
                        {formatAddress(data)}
                      </p>
                      {source === 'profile' && (
                        <p className="text-xs text-blue-600 mt-1">
                          (Using address from customer profile)
                        </p>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items ({order.items?.length || 0} items)</h3>
            <div className="space-y-3">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: OrderItem, index: number) => (
                  <div key={item.id || index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                    {item.img && (
                      <img 
                        src={item.img} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.variant && (
                        <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                      )}
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">Quantity: {item.qty}</span>
                        <span className="font-medium">{formatCurrency(item.price * item.qty)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Order Date</h3>
              <p className="text-sm">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p className="text-sm">{formatDate(order.updated_at)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}