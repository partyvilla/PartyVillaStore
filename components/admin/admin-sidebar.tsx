"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/utils"

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/stock", label: "Stock Management" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/delivery", label: "Delivery Zones" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-card w-screen md:w-[20vw] md:border-r border-border">
      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:gap-1 md:overflow-visible items-center md:items-start text-center md:text-start">
        {links.map((l) => {
          const active = pathname === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors w-full",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
