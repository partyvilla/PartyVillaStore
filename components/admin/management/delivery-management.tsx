"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeliveryAddress, getDeliveryAddresses, deleteDeliveryAddress } from "@/lib/database/services/supabase-delivery"
import { DeliveryForm } from "../forms/delivery-form"
import { useCustomToast } from "@/hooks/use-custom-toast"

export function DeliveryManagement() {
  const { showToast } = useCustomToast()
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<DeliveryAddress | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const loadDeliveryAddresses = async () => {
    try {
      setLoading(true)
      const deliveryData = await getDeliveryAddresses()
      setDeliveryAddresses(deliveryData)
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to load delivery addresses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeliveryAddresses()
  }, [])

  const handleDelete = async (deliveryAddress: DeliveryAddress) => {
    if (!confirm(`Are you sure you want to delete delivery settings for pincode "${deliveryAddress.pincode}"?`)) {
      return
    }

    setDeleteLoading(deliveryAddress.id)
    try {
      const success = await deleteDeliveryAddress(deliveryAddress.id)
      
      if (!success) {
        showToast({
          title: "Error",
          description: "Failed to delete delivery address",
          variant: "destructive"
        })
        return
      }

      showToast({
        title: "Success",
        description: "Delivery address deleted successfully",
      })

      loadDeliveryAddresses() // Reload delivery addresses
    } catch (error) {
      showToast({
        title: "Error",
        description: "Failed to delete delivery address",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleEdit = (deliveryAddress: DeliveryAddress) => {
    setSelectedDeliveryAddress(deliveryAddress)
    setFormOpen(true)
  }

  const handleAdd = () => {
    setSelectedDeliveryAddress(null)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    loadDeliveryAddresses() // Reload delivery addresses after successful create/update
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading delivery zones...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivery Zones</CardTitle>
          <Button onClick={handleAdd} size="sm">
            + Add Delivery Zone
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pincode</TableHead>
                <TableHead>Delivery Charge</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryAddresses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No delivery zones found. Add your first delivery zone to get started.
                  </TableCell>
                </TableRow>
              ) : (
                deliveryAddresses.map((deliveryAddress) => (
                  <TableRow key={deliveryAddress.id}>
                    <TableCell className="font-medium">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {deliveryAddress.pincode}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">₹{deliveryAddress.delivery_charge.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(deliveryAddress.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(deliveryAddress)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(deliveryAddress)}
                          disabled={deleteLoading === deliveryAddress.id}
                        >
                          {deleteLoading === deliveryAddress.id ? "..." : "Delete"}
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

      <DeliveryForm
        deliveryAddress={selectedDeliveryAddress}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={handleFormSuccess}
      />
    </>
  )
}