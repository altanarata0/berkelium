"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

type ShopFiltersProps = {
  categories: { id: string; name: string }[]
  activeCategory?: string
}

export function ShopFilters({ categories, activeCategory }: ShopFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href="/shop"
        className={cn(
          "px-5 py-2 text-xs font-body tracking-[0.2em] uppercase border transition-all duration-300",
          !activeCategory
            ? "bg-berkeley-blue text-off-white border-berkeley-blue"
            : "bg-transparent text-charcoal/60 border-charcoal/15 hover:border-berkeley-blue hover:text-berkeley-blue"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/shop?category=${cat.name.toLowerCase()}`}
          className={cn(
            "px-5 py-2 text-xs font-body tracking-[0.2em] uppercase border transition-all duration-300",
            activeCategory?.toLowerCase() === cat.name.toLowerCase()
              ? "bg-berkeley-blue text-off-white border-berkeley-blue"
              : "bg-transparent text-charcoal/60 border-charcoal/15 hover:border-berkeley-blue hover:text-berkeley-blue"
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
