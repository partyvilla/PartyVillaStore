"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createBrowserClient } from "@/lib/database/supabase"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils/currency"
import { getStatusColor } from "@/lib/database/services/supabase-orders"

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      
      if (!data.session) {
        router.push('/auth/login')
        return
      }
      
      setUser(data.session.user)
      fetchOrders()
    }

    getUser()
  }, [router, supabase.auth])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-6xl">
        <div className="animate-pulse h-64 bg-gray-200 rounded-md"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:space-y-8 md:py-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/account" className="hover:underline">
              Account
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            My Orders
          </li>
        </ol>
      </nav>

      <div className="space-y-6">
        <div>
          <h1 className="text-pretty text-2xl font-semibold md:text-3xl">My Orders</h1>
          <p className="text-sm text-muted-foreground">View your order history and track current orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order History ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {Array.isArray(order.items) 
                          ? order.items.reduce((total: number, item: any) => total + (item.qty || 0), 0)
                          : order.items || 0
                        } items
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(order.total_price || 0))}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                <Link 
                  href="/shop" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}