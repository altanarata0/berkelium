import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-berkeley-blue flex items-center justify-center px-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(253,181,21,1) 1px, transparent 1px), linear-gradient(90deg, rgba(253,181,21,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* Element-style 404 */}
        <div className="inline-flex flex-col items-center mb-8">
          <div className="w-36 h-44 border-2 border-california-gold/20 flex flex-col items-center justify-center">
            <span className="text-xs text-california-gold/40 font-body tracking-[0.3em]">
              404
            </span>
            <span className="text-7xl font-heading font-bold text-california-gold leading-none mt-1">
              Bk
            </span>
            <span className="text-[10px] text-california-gold/40 font-body tracking-[0.2em] uppercase mt-2">
              Not Found
            </span>
          </div>
        </div>

        <h1 className="font-heading text-3xl text-off-white mb-4">
          Element Not Discovered
        </h1>
        <p className="text-off-white/50 font-body mb-8">
          This page doesn&apos;t exist — yet. Unlike Berkelium, some things
          remain undiscovered.
        </p>

        <Link
          href="/"
          className="inline-block bg-california-gold text-berkeley-blue font-body text-sm tracking-[0.3em] uppercase px-8 py-4 hover:bg-california-gold/90 transition-colors duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
