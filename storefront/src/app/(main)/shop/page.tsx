import { getProducts, getCategories } from "@/lib/data"
import { ProductCard } from "@/components/product/ProductCard"
import { ShopFilters } from "./filters"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Berkelium apparel — hoodies, tees, and hats featuring the Bk mark.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categories = await getCategories()
  const activeCategorySlug = params.category

  const activeCategory = activeCategorySlug
    ? categories.find(
        (c: any) => c.name.toLowerCase() === activeCategorySlug.toLowerCase()
      )
    : null

  const products = await getProducts(50, activeCategory?.id)

  return (
    <div className="bg-off-white min-h-screen">
      {/* Page header */}
      <div className="bg-berkeley-blue py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold/60 mb-3 block">
            Element 97
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-off-white">
            Shop
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category filters */}
        <ShopFilters
          categories={categories.map((c: any) => ({
            id: c.id,
            name: c.name,
          }))}
          activeCategory={activeCategorySlug}
        />

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <span className="text-6xl font-heading text-berkeley-blue/10 block mb-4">
              Bk
            </span>
            <p className="text-charcoal/50 font-body">
              No products found. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
