"use client"

/**
 * The Bk badge — periodic table element card motif.
 * Renders "97 / Bk / Berkelium" in the periodic table style.
 */
export function BkBadge({
  size = "md",
  variant = "gold-on-blue",
}: {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "gold-on-blue" | "blue-on-gold" | "blue-on-white"
}) {
  const sizeMap = {
    sm: { wrapper: "w-12 h-14", number: "text-[8px]", symbol: "text-lg", name: "text-[6px]" },
    md: { wrapper: "w-20 h-24", number: "text-[10px]", symbol: "text-3xl", name: "text-[8px]" },
    lg: { wrapper: "w-28 h-32", number: "text-xs", symbol: "text-5xl", name: "text-[10px]" },
    xl: { wrapper: "w-40 h-48", number: "text-sm", symbol: "text-7xl", name: "text-xs" },
  }

  const variantMap = {
    "gold-on-blue": "bg-berkeley-blue text-california-gold border-california-gold/30",
    "blue-on-gold": "bg-california-gold text-berkeley-blue border-berkeley-blue/30",
    "blue-on-white": "bg-white text-berkeley-blue border-berkeley-blue/20",
  }

  const s = sizeMap[size]

  return (
    <div
      className={`${s.wrapper} ${variantMap[variant]} border-2 flex flex-col items-center justify-center relative`}
    >
      <span className={`${s.number} font-body tracking-[0.3em] uppercase opacity-70`}>
        97
      </span>
      <span className={`${s.symbol} font-heading font-bold leading-none`}>
        Bk
      </span>
      <span className={`${s.name} font-body tracking-[0.2em] uppercase opacity-70`}>
        Berkelium
      </span>
    </div>
  )
}
