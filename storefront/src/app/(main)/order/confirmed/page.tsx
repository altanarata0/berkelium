"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-24 md:py-32 text-center">
        {/* Success badge */}
        <div className="inline-flex flex-col items-center mb-8">
          <div className="w-24 h-28 border-2 border-california-gold/40 flex flex-col items-center justify-center mb-2">
            <span className="text-[8px] text-california-gold/50 font-body tracking-[0.2em]">
              97
            </span>
            <span className="text-4xl font-heading font-bold text-california-gold leading-none">
              Bk
            </span>
            <span className="text-[7px] text-california-gold/50 font-body tracking-[0.15em] uppercase mt-1">
              Berkelium
            </span>
          </div>
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center -mt-5 relative z-10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl text-charcoal mb-4">
          Order Confirmed
        </h1>

        <p className="font-body text-charcoal/60 text-lg mb-2">
          Thank you for your order.
        </p>

        <p className="font-body text-charcoal/40 text-sm mb-10">
          You&apos;ll receive a confirmation email shortly with tracking details
          once your order ships.
        </p>

        {orderId && (
          <div className="bg-white border border-charcoal/5 px-6 py-4 inline-block mb-10">
            <span className="text-xs font-body tracking-[0.2em] uppercase text-charcoal/40 block mb-1">
              Order Reference
            </span>
            <span className="font-body text-charcoal text-sm">
              {orderId.slice(0, 20)}...
            </span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-block bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase px-8 py-4 hover:bg-berkeley-blue/90 transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account"
            className="inline-block border-2 border-berkeley-blue text-berkeley-blue font-body text-sm tracking-[0.3em] uppercase px-8 py-4 hover:bg-berkeley-blue hover:text-off-white transition-all duration-300"
          >
            View Orders
          </Link>
        </div>

        {/* Decorative element */}
        <div className="mt-20 pt-10 border-t border-charcoal/5">
          <p className="text-xs font-body tracking-[0.4em] uppercase text-charcoal/20">
            Element 97 &middot; Actinide Series &middot; Period 7
          </p>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-off-white flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-berkeley-blue/20 border-t-berkeley-blue rounded-full animate-spin" />
        </div>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  )
}
