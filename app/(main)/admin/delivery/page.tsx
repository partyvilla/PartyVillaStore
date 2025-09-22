import { DeliveryManagement } from "@/components/admin/management/delivery-management"

export default function AdminDeliveryPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-pretty text-2xl font-semibold md:text-3xl">Delivery Management</h1>
        <p className="text-sm text-muted-foreground">Manage pincodes and delivery charges for delivery zones.</p>
      </header>

      <DeliveryManagement />
    </main>
  )
}