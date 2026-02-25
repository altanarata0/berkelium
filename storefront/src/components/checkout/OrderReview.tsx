"use client"

import Image from "next/image"
import { formatPrice } from "@/lib/utils"

type OrderReviewProps = {
  cart: any
}

export function OrderReview({ cart }: OrderReviewProps) {
  if (!cart) return null

  const items = cart.items || []
  const addr = cart.shipping_address

  return (
    <div className="bg-white border border-charcoal/5 p-6">
      <h3 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-6">
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-4 items-center">
            <div className="relative w-14 h-16 bg-off-white flex-shrink-0 overflow-hidden">
              {item.thumbnail ? (
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-sm font-heading text-berkeley-blue/10">
                    Bk
                  </span>
                </div>
              )}
              {/* Quantity badge */}
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-berkeley-blue text-off-white text-[10px] rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body text-charcoal truncate">
                {item.product_title || item.title}
              </p>
              <p className="text-xs text-charcoal/50 font-body">
                {item.variant?.title}
              </p>
            </div>
            <span className="text-sm font-body text-charcoal">
              {formatPrice(item.unit_price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-charcoal/10 pt-4 space-y-2 text-sm font-body">
        <div className="flex justify-between">
          <span className="text-charcoal/60">Subtotal</span>
          <span>{formatPrice(cart.subtotal || 0)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal/60">Shipping</span>
          <span>
            {cart.shipping_total
              ? formatPrice(cart.shipping_total)
              : "—"}
          </span>
        </div>
        {(cart.tax_total ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-charcoal/60">Tax</span>
            <span>{formatPrice(cart.tax_total)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-charcoal/10 pt-3 mt-3">
          <span className="font-heading text-lg text-charcoal">Total</span>
          <span className="font-heading text-lg text-charcoal">
            {formatPrice(cart.total || cart.subtotal || 0)}
          </span>
        </div>
      </div>

      {/* Shipping address */}
      {addr && (
        <div className="mt-6 pt-6 border-t border-charcoal/10">
          <h4 className="text-xs font-body tracking-[0.2em] uppercase text-charcoal/40 mb-2">
            Shipping to
          </h4>
          <p className="text-sm font-body text-charcoal/70 leading-relaxed">
            {addr.first_name} {addr.last_name}
            <br />
            {addr.address_1}
            {addr.address_2 ? `, ${addr.address_2}` : ""}
            <br />
            {addr.city}, {addr.province} {addr.postal_code}
          </p>
        </div>
      )}
    </div>
  )
}
