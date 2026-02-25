"use client"

import { useState } from "react"
import { useCart } from "@/providers/cart"
import { useToast } from "@/components/ui/Toast"

type AddToCartButtonProps = {
  variantId: string | null
  disabled?: boolean
}

export function AddToCartButton({ variantId, disabled }: AddToCartButtonProps) {
  const { addItem, loading } = useCart()
  const { toast } = useToast()
  const [added, setAdded] = useState(false)

  const handleClick = async () => {
    if (!variantId || disabled) return
    try {
      await addItem(variantId)
      setAdded(true)
      toast("Added to cart")
      setTimeout(() => setAdded(false), 2000)
    } catch {
      toast("Failed to add item", "error")
    }
  }

  const isDisabled = !variantId || disabled || loading

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        w-full py-4 text-sm font-body tracking-[0.3em] uppercase transition-all duration-300
        ${
          added
            ? "bg-green-700 text-white"
            : isDisabled
              ? "bg-charcoal/20 text-charcoal/40 cursor-not-allowed"
              : "bg-berkeley-blue text-off-white hover:bg-berkeley-blue/90"
        }
      `}
    >
      {added ? "Added to Cart" : loading ? "Adding..." : !variantId ? "Select Options" : "Add to Cart"}
    </button>
  )
}
