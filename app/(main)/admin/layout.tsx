import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex flex-col md:flex-row h-[75vh] overflow-hidden">
        <AdminSidebar />
        <section className="p-4 md:p-6 w-full overflow-y-scroll">{children}</section>
      </div>
  )
}
