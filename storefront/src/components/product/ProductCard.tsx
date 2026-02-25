"use client"

import Link from "next/link"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"

type ProductCardProps = {
  product: {
    id: string
    title: string
    handle: string
    thumbnail: string | null
    images?: { url: string }[]
    variants?: { prices?: { amount: number; currency_code: string }[] }[]
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const price = product.variants?.[0]?.prices?.[0]
  const primaryImage = product.thumbnail || product.images?.[0]?.url
  const secondaryImage = product.images?.[1]?.url

  return (
    <Link href={`/shop/${product.handle}`} className="group block">
      {/* Image container */}
      <div className="relative aspect-[4/5] bg-off-white overflow-hidden mb-4">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt={`${product.title} alternate`}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-berkeley-blue/5">
            <span className="text-6xl font-heading font-bold text-berkeley-blue/10">
              Bk
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-berkeley-blue/0 group-hover:bg-berkeley-blue/5 transition-colors duration-300" />

        {/* Quick-view indicator */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-berkeley-blue text-off-white text-center text-xs font-body tracking-[0.3em] uppercase py-3">
          View Product
        </div>
      </div>

      {/* Info */}
      <h3 className="font-heading text-lg text-charcoal group-hover:text-berkeley-blue transition-colors duration-300">
        {product.title}
      </h3>
      {price && (
        <p className="text-sm text-charcoal/60 font-body mt-1">
          {formatPrice(price.amount, price.currency_code)}
        </p>
      )}
    </Link>
  )
}
