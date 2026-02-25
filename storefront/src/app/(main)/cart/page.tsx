"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/providers/cart"
import { formatPrice } from "@/lib/utils"

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart()

  const items = cart?.items || []
  const isEmpty = items.length === 0

  return (
    <div className="bg-off-white min-h-screen">
      {/* Header */}
      <div className="bg-berkeley-blue py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold/60 mb-3 block">
            Your Selection
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-off-white">
            Cart
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {isEmpty ? (
          /* ── Empty state ─────────────────────────────────────── */
          <div className="text-center py-24">
            <div className="w-20 h-24 border-2 border-berkeley-blue/10 flex flex-col items-center justify-center mx-auto mb-6">
              <span className="text-[8px] text-berkeley-blue/20 font-body tracking-[0.2em]">
                97
              </span>
              <span className="text-2xl font-heading font-bold text-berkeley-blue/15 leading-none">
                Bk
              </span>
            </div>
            <p className="text-charcoal/50 font-body mb-6">
              Your cart is empty.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase px-8 py-3 hover:bg-berkeley-blue/90 transition-colors duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* ── Cart contents ───────────────────────────────────── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="border-b border-charcoal/10 pb-4 mb-6 hidden md:grid grid-cols-[1fr_auto_auto_auto] gap-8 items-center">
                <span className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/40">
                  Product
                </span>
                <span className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/40 w-28 text-center">
                  Quantity
                </span>
                <span className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/40 w-24 text-right">
                  Price
                </span>
                <span className="w-8" />
              </div>

              <div className="space-y-6">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[80px_1fr] md:grid-cols-[80px_1fr_auto_auto_auto] gap-4 md:gap-8 items-center pb-6 border-b border-charcoal/5"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 bg-off-white overflow-hidden flex-shrink-0">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl font-heading text-berkeley-blue/10">
                            Bk
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <h3 className="font-heading text-base text-charcoal truncate">
                        {item.product_title || item.title}
                      </h3>
                      <p className="text-xs text-charcoal/50 font-body mt-1">
                        {item.variant?.title || item.title}
                      </p>
                      <p className="text-sm text-charcoal/70 font-body mt-1 md:hidden">
                        {formatPrice(item.unit_price)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-charcoal/15 w-28 justify-between col-start-2 md:col-start-auto">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem(item.id, item.quantity - 1)
                            : removeItem(item.id)
                        }
                        disabled={loading}
                        className="px-3 py-2 text-charcoal/50 hover:text-charcoal transition-colors text-sm"
                      >
                        &minus;
                      </button>
                      <span className="text-sm font-body text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        disabled={loading}
                        className="px-3 py-2 text-charcoal/50 hover:text-charcoal transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-body text-charcoal/70 w-24 text-right hidden md:block">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={loading}
                      className="w-8 h-8 flex items-center justify-center text-charcoal/30 hover:text-red-600 transition-colors hidden md:flex"
                      title="Remove item"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 border border-charcoal/5 sticky top-24">
                <h2 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Subtotal</span>
                    <span className="text-charcoal">
                      {formatPrice(cart?.subtotal || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60">Shipping</span>
                    <span className="text-charcoal/60">
                      {cart?.shipping_total
                        ? formatPrice(cart.shipping_total)
                        : "Calculated at checkout"}
                    </span>
                  </div>
                  {(cart?.tax_total ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-charcoal/60">Tax</span>
                      <span className="text-charcoal">
                        {formatPrice(cart!.tax_total)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-charcoal/10 pt-4 mb-8">
                  <div className="flex justify-between">
                    <span className="font-heading text-lg text-charcoal">
                      Total
                    </span>
                    <span className="font-heading text-lg text-charcoal">
                      {formatPrice(cart?.total || cart?.subtotal || 0)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-berkeley-blue text-off-white text-center font-body text-sm tracking-[0.3em] uppercase py-4 hover:bg-berkeley-blue/90 transition-colors duration-300"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full text-center font-body text-xs tracking-[0.2em] uppercase text-charcoal/50 hover:text-berkeley-blue mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
