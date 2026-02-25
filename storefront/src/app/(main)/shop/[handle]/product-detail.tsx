"use client"

import { useState, useMemo } from "react"
import { ImageGallery } from "@/components/product/ImageGallery"
import { VariantSelector } from "@/components/product/VariantSelector"
import { AddToCartButton } from "@/components/product/AddToCartButton"
import { formatPrice } from "@/lib/utils"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductDetail({ product }: { product: any }) {
  const [selected, setSelected] = useState<Record<string, string>>({})

  const handleOptionChange = (title: string, value: string) => {
    setSelected((prev) => ({ ...prev, [title]: value }))
  }

  const activeVariant = useMemo(() => {
    if (Object.keys(selected).length !== product.options.length) return null

    return product.variants.find((v: any) =>
      v.options.every((opt: any) => {
        const optionTitle = opt.option?.title || ""
        return selected[optionTitle] === opt.value
      })
    ) || null
  }, [selected, product])

  const price = activeVariant?.prices?.[0] || product.variants[0]?.prices?.[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      {/* Left — Images */}
      <ImageGallery images={product.images} title={product.title} />

      {/* Right — Product info */}
      <div className="flex flex-col">
        {/* Breadcrumb-style element tag */}
        <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold mb-4">
          Element 97
        </span>

        <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-2">
          {product.title}
        </h1>

        {price && (
          <p className="text-xl font-body text-charcoal/70 mb-8">
            {formatPrice(price.amount, price.currency_code)}
          </p>
        )}

        {/* Variant selector */}
        <div className="mb-8">
          <VariantSelector
            options={product.options}
            selected={selected}
            onChange={handleOptionChange}
          />
        </div>

        {/* Add to cart */}
        <AddToCartButton variantId={activeVariant?.id || null} />

        {/* Description */}
        <div className="mt-10 pt-8 border-t border-charcoal/10">
          <h3 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-4">
            Description
          </h3>
          <p className="font-body text-charcoal/70 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Product details meta */}
        <div className="mt-8 pt-8 border-t border-charcoal/10">
          <h3 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-4">
            Details
          </h3>
          <ul className="space-y-2 text-sm font-body text-charcoal/60">
            <li>Fulfilled by Printful print-on-demand</li>
            <li>Ships from the United States</li>
            <li>Standard delivery: 5-8 business days</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
