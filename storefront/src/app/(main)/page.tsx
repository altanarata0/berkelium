import Link from "next/link"
import { getProducts } from "@/lib/data"
import { ProductCard } from "@/components/product/ProductCard"

export default async function HomePage() {
  const products = await getProducts(3)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-berkeley-blue min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background pattern — periodic table grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(253,181,21,1) 1px, transparent 1px), linear-gradient(90deg, rgba(253,181,21,1) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        {/* Floating element number */}
        <div className="absolute top-1/4 left-8 md:left-16 opacity-[0.06] select-none">
          <span className="text-[12rem] md:text-[20rem] font-heading font-bold text-california-gold leading-none">
            97
          </span>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Element badge */}
          <div className="inline-flex flex-col items-center mb-8">
            <div className="w-32 h-40 border-2 border-california-gold/30 flex flex-col items-center justify-center mb-8 hover:border-california-gold/60 transition-colors duration-500">
              <span className="text-xs text-california-gold/60 font-body tracking-[0.3em]">
                97
              </span>
              <span className="text-6xl font-heading font-bold text-california-gold leading-none mt-1">
                Bk
              </span>
              <span className="text-[10px] text-california-gold/60 font-body tracking-[0.2em] uppercase mt-2">
                Berkelium
              </span>
            </div>
          </div>

          <h1 className="text-off-white font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6">
            Wear the Element
          </h1>

          <p className="text-off-white/50 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            High quality apparel inspired by element 97.
          </p>

          <Link
            href="/shop"
            className="inline-block bg-california-gold text-berkeley-blue font-body text-sm tracking-[0.3em] uppercase px-10 py-4 hover:bg-california-gold/90 transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-california-gold/30 to-transparent" />
      </section>

      {/* ── Brand Story ───────────────────────────────────────────── */}
      <section id="story" className="bg-off-white py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left — element detail */}
            <div className="flex justify-center md:justify-end">
              <div className="relative">
                <div className="w-48 h-56 border-2 border-berkeley-blue/15 flex flex-col items-center justify-center">
                  <span className="text-xs text-berkeley-blue/40 font-body tracking-[0.3em]">
                    97
                  </span>
                  <span className="text-7xl font-heading font-bold text-berkeley-blue leading-none mt-1">
                    Bk
                  </span>
                  <span className="text-[10px] text-berkeley-blue/40 font-body tracking-[0.2em] uppercase mt-2">
                    Berkelium
                  </span>
                  <span className="text-[9px] text-berkeley-blue/30 font-body tracking-wider mt-1">
                    (247)
                  </span>
                </div>
                {/* Decorative atomic number */}
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-california-gold flex items-center justify-center">
                  <span className="text-berkeley-blue text-xs font-bold font-body">
                    97
                  </span>
                </div>
              </div>
            </div>

            {/* Right — narrative */}
            <div>
              <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold mb-4 block">
                The Element
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal mb-6 leading-tight">
                Element 97.
                <br />
                Berkelium.
              </h2>
              <div className="space-y-4 text-charcoal/70 font-body leading-relaxed">
                <p>
                  In 1949, researchers at the University of California, Berkeley
                  synthesized element 97 — Berkelium. Named after the city and the
                  university, it became part of the periodic table forever.
                </p>
                <p>
                  We put it on hoodies, tees, and hats. A mark rooted in
                  discovery, worn with intention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold mb-3 block">
                Collection
              </span>
              <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
                Featured
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-sm font-body tracking-[0.2em] uppercase text-berkeley-blue hover:text-california-gold transition-colors duration-300 hidden md:block"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/shop"
              className="text-sm font-body tracking-[0.2em] uppercase text-berkeley-blue hover:text-california-gold transition-colors duration-300"
            >
              View All Products &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="bg-berkeley-blue py-20 md:py-28 relative overflow-hidden">
        {/* Subtle diagonal line decoration */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(253,181,21,1) 40px, rgba(253,181,21,1) 41px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <p className="text-california-gold/60 font-body text-xs tracking-[0.5em] uppercase mb-6">
            Actinide Series &middot; Period 7
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-off-white mb-8 leading-tight">
            Wear the element.
            <br />
            Element 97.
          </h2>
          <Link
            href="/shop"
            className="inline-block border-2 border-california-gold text-california-gold font-body text-sm tracking-[0.3em] uppercase px-10 py-4 hover:bg-california-gold hover:text-berkeley-blue transition-all duration-300"
          >
            Shop the Collection
          </Link>
        </div>
      </section>
    </>
  )
}
