"use client"

import Link from "next/link"

type Category = {
  name: string
  href: string
  imgAlt: string
  img: string
}

export function CategoryShortcuts({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-pretty text-lg font-semibold md:text-xl">Shop by Category</h2>
        <Link href="/categories" className="text-sm text-primary hover:underline" aria-label="View all categories">
          View all
        </Link>
      </div>
      {/* Mobile: horizontal scroll; Desktop: compact grid */}
      <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group flex min-w-[110px] shrink-0 flex-col items-center rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted md:min-w-0"
            aria-label={`Browse ${cat.name}`}
          >
            <img
              src={cat.img || "/placeholder.svg"}
              alt={cat.imgAlt}
              className="h-16 w-16 rounded-full border border-border object-cover transition-transform duration-200 ease-out group-hover:scale-105"
            />
            <span className="mt-2 line-clamp-1 text-center text-sm font-medium">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
