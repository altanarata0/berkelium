import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-charcoal text-off-white/60">
      {/* Decorative gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-california-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-12 border border-california-gold/30 flex flex-col items-center justify-center">
                <span className="text-[7px] text-california-gold/50 font-body tracking-[0.2em]">
                  97
                </span>
                <span className="text-xl font-heading font-bold text-california-gold leading-none">
                  Bk
                </span>
              </div>
              <span className="text-off-white font-heading text-xl tracking-wide">
                Berkelium
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Element 97. Discovered at UC Berkeley in 1949. The university was
              offered the mark and rejected it. We picked it up.
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-off-white font-body text-xs tracking-[0.3em] uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?category=hoodies" className="hover:text-california-gold transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=tees" className="hover:text-california-gold transition-colors">
                  Tees
                </Link>
              </li>
              <li>
                <Link href="/shop?category=hats" className="hover:text-california-gold transition-colors">
                  Hats
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / Info */}
          <div>
            <h4 className="text-off-white font-body text-xs tracking-[0.3em] uppercase mb-4">
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-california-gold transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://reddit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-california-gold transition-colors"
                >
                  Reddit
                </a>
              </li>
              <li>
                <Link href="/account" className="hover:text-california-gold transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-off-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Berkelium. All rights reserved.
          </p>
          <p className="text-xs opacity-50 font-body tracking-wider">
            ELEMENT 97 &middot; ATOMIC MASS 247 &middot; ACTINIDE SERIES
          </p>
        </div>
      </div>
    </footer>
  )
}
