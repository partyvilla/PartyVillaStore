"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DeliveryAddress, DeliveryAddressInsert, DeliveryAddressUpdate, createDeliveryAddress, updateDeliveryAddress, isPincodeExists } from "@/lib/database/services/supabase-delivery"
import { useCustomToast } from "@/hooks/use-custom-toast"

interface DeliveryFormProps {
  deliveryAddress?: DeliveryAddress | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeliveryForm({ deliveryAddress, open, onOpenChange, onSuccess }: DeliveryFormProps) {
  const { showToast } = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DeliveryAddressInsert>({
    pincode: deliveryAddress?.pincode || "",
    delivery_charge: deliveryAddress?.delivery_charge || 0,
  })

  const isEditing = !!deliveryAddress

  // Reset form when deliveryAddress changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        pincode: deliveryAddress?.pincode || "",
        delivery_charge: deliveryAddress?.delivery_charge || 0,
      })
    }
  }, [deliveryAddress, open])

  const validateForm = () => {
    if (!formData.pincode.trim()) {
      showToast({
        title: "Validation Error",
        description: "Pincode is required",
        variant: "destructive"
      })
      return false
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      showToast({
        title: "Validation Error",
        description: "Pincode must be exactly 6 digits",
        variant: "destructive"
      })
      return false
    }

    if (formData.delivery_charge < 0) {
      showToast({
        title: "Validation Error",
        description: "Delivery charge cannot be negative",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Check if pincode already exists (for new entries or when editing and pincode changed)
      if (!isEditing || (isEditing && formData.pincode !== deliveryAddress.pincode)) {
        const pincodeExists = await isPincodeExists(
          formData.pincode,
          isEditing ? deliveryAddress.id : undefined
        )
        
        if (pincodeExists) {
          showToast({
            title: "Error",
            description: "A delivery zone with this pincode already exists",
            variant: "destructive"
          })
          setLoading(false)
          return
        }
      }

      let result
      if (isEditing) {
        result = await updateDeliveryAddress(deliveryAddress.id, formData as DeliveryAddressUpdate)
      } else {
        result = await createDeliveryAddress(formData)
      }

      if (!result) {
        showToast({
          title: "Error",
          description: `Failed to ${isEditing ? "update" : "create"} delivery zone`,
          variant: "destructive"
        })
        return
      }

      showToast({
        title: "Success",
        description: `Delivery zone ${isEditing ? "updated" : "created"} successfully`,
      })

      onSuccess()
      onOpenChange(false)
      
      // Reset form for new entries
      if (!isEditing) {
        setFormData({
          pincode: "",
          delivery_charge: 0,
        })
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

  const handlePincodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/\D/g, '').slice(0, 6)
    setFormData(prev => ({
      ...prev,
      pincode: cleanValue
    }))
  }

  const handleDeliveryChargeChange = (value: string) => {
    const numValue = parseFloat(value)
    setFormData(prev => ({
      ...prev,
      delivery_charge: numValue
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Delivery Zone" : "Add Delivery Zone"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update the pincode and delivery charge for this delivery zone."
              : "Add a new delivery zone with pincode and delivery charge."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              type="text"
              placeholder="Enter 6-digit pincode"
              value={formData.pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              maxLength={6}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter a valid 6-digit pincode (numbers only)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_charge">Delivery Charge (₹)</Label>
            <Input
              id="delivery_charge"
              type="number"
              placeholder="Enter delivery charge"
              value={formData.delivery_charge}
              onChange={(e) => handleDeliveryChargeChange(e.target.value)}
              min="0"
              step="0.01"
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter the delivery charge for this pincode zone
            </p>
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