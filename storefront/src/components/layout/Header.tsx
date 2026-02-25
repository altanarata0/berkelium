"use client"

import Link from "next/link"
import { useCart } from "@/providers/cart"
import { useState } from "react"

export function Header() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-berkeley-blue/95 backdrop-blur-sm border-b border-california-gold/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-10 border border-california-gold/40 flex flex-col items-center justify-center group-hover:border-california-gold transition-colors duration-300">
            <span className="text-[6px] text-california-gold/60 font-body tracking-[0.2em]">
              97
            </span>
            <span className="text-base font-heading font-bold text-california-gold leading-none">
              Bk
            </span>
          </div>
          <span className="text-off-white font-heading text-lg tracking-wide hidden sm:block">
            Berkelium
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/shop"
            className="text-off-white/80 hover:text-california-gold text-sm font-body tracking-widest uppercase transition-colors duration-300"
          >
            Shop
          </Link>
          <Link
            href="/#story"
            className="text-off-white/80 hover:text-california-gold text-sm font-body tracking-widest uppercase transition-colors duration-300"
          >
            Our Story
          </Link>
          <Link
            href="/account"
            className="text-off-white/80 hover:text-california-gold text-sm font-body tracking-widest uppercase transition-colors duration-300"
          >
            Account
          </Link>
        </div>

        {/* Cart + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative text-off-white hover:text-california-gold transition-colors duration-300"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-california-gold text-berkeley-blue text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-off-white"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {menuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-berkeley-blue border-t border-california-gold/10 px-6 py-4 flex flex-col gap-4">
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="text-off-white/80 hover:text-california-gold text-sm font-body tracking-widest uppercase"
          >
            Shop
          </Link>
          <Link
            href="/#story"
            onClick={() => setMenuOpen(false)}
            className="text-off-white/80 hover:text-california-gold text-sm font-body tracking-widest uppercase"
          >
            Our Story
          </Link>
          <Link
            href="/account"
            onClick={() => setMenuOpen(false)}
            className="text-off-white/80 hover:text-california-gold text-sm font-body tracking-widest uppercase"
          >
            Account
          </Link>
        </div>
      )}
    </header>
  )
}
