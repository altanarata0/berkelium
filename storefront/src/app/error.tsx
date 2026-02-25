"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-24 border-2 border-red-300/40 flex flex-col items-center justify-center mx-auto mb-6">
          <span className="text-[8px] text-red-400/60 font-body tracking-[0.2em]">
            ERR
          </span>
          <span className="text-3xl font-heading font-bold text-red-400 leading-none">
            Bk
          </span>
        </div>

        <h1 className="font-heading text-2xl text-charcoal mb-3">
          Something went wrong
        </h1>
        <p className="text-charcoal/50 font-body text-sm mb-8">
          An unexpected error occurred. Even elements can be unstable.
        </p>

        <button
          onClick={reset}
          className="inline-block bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase px-8 py-3 hover:bg-berkeley-blue/90 transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
