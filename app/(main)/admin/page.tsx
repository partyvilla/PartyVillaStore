import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getOrders, getStatusColor } from "@/lib/database/services/supabase-orders"
import { getProducts } from "@/lib/database/services/supabase-products"
import { formatCurrency } from "@/lib/utils/currency"
import { createServerClient } from "@/lib/database/supabase-server"
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const supabase = await createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  const [orders, products] = await Promise.all([
    getOrders(5),
    getProducts()
  ])

  const totalProducts = products.length
  const monthlySales = orders.reduce((s: number, o: any) => s + parseFloat(o.total_price || 0), 0)
  const pending = orders.filter((o: any) => o.status === "pending").length

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Quick overview of key metrics and recent orders.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard title="Products" value={`${totalProducts}`} sub="Total active products" />
        <AdminMetricCard title="Monthly Sales" value={formatCurrency(monthlySales)} sub="From recent orders" />
        <AdminMetricCard title="Pending Orders" value={`${pending}`} />
        <AdminMetricCard title="Conversion" value="2.4%" sub="Demo metric" />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Orders</CardTitle>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o: any) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.id.substring(0, 8)}</TableCell>
                    <TableCell>{o.profiles?.name || 'Unknown Customer'}</TableCell>
                    <TableCell>{o.payee_name || 'Unknown Payee'}</TableCell>
                    <TableCell>{new Date(o.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(parseFloat(o.total_price))}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
