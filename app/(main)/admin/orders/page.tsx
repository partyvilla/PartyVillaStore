"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrders, getStatusColor, getOrderById } from "@/lib/database/services/supabase-orders"
import { formatCurrency } from "@/lib/utils/currency"
import { supabase } from "@/lib/database/supabase"
import { useRouter } from 'next/navigation'
import { OrderDetailsDialog } from "@/components/admin/dialogs/order-details-dialog"
import { Button } from "@/components/ui/button"

interface OrderWithProfile {
  id: string
  user_id: string
  items: any[]
  total_price: number
  status: string
  delivery_address: any
  upi_ref: string
  payee_name: string
  created_at: string
  updated_at: string
  profiles?: {
    name: string
    phone?: string
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithProfile[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProfile | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/login')
        return
      }
      setSession(session)
    }

    checkSession()
  }, [router])

  useEffect(() => {
    if (!session) return

    const fetchOrders = async () => {
      try {
        // Pass the client-side supabase client to getOrders
        const ordersData = await getOrders(100, supabase)
        setOrders(ordersData.map((order: any) => ({
          ...order,
          profiles: order.profiles ? { name: order.profiles.name, phone: order.profiles.phone } : undefined
        })))
      } catch (error) {
        // Handle error silently as before
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [session])

  const handleOrderClick = async (orderId: string) => {
    // Find the order from our current list
    const order = orders.find(o => o.id === orderId)
    if (order) {
      setSelectedOrder(order)
      setIsDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedOrder(null)
  }

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    // Update the order in the local state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      )
    )
  }

  if (!session || loading) {
    return (
      <main className="space-y-6">
        <header>
          <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Orders</h1>
          <p className="text-sm text-muted-foreground">View and update order status.</p>
        </header>
        <div className="flex items-center justify-center h-64">
          <p>Loading orders...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Orders</h1>
        <p className="text-sm text-muted-foreground">View and update order status.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payee Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((o: OrderWithProfile) => (
                  <TableRow 
                    key={o.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleOrderClick(o.id)}
                  >
                    <TableCell className="font-medium">#{o.id.substring(0, 8)}</TableCell>
                    <TableCell>{o.profiles?.name || 'Unknown Customer'}</TableCell>
                    <TableCell>{o.payee_name || 'Unknown Payee'}</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(parseFloat(o.total_price.toString()))}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${getStatusColor(o.status as any)}`}>
                        {o.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOrderClick(o.id)
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found. Orders will appear here once customers place them.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailsDialog 
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onStatusUpdate={handleStatusUpdate}
        order={selectedOrder}
      />
    </main>
  )
}
