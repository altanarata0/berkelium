"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/providers/auth"

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await register(form)
      router.push("/account")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    }
  }

  const inputClass =
    "w-full px-4 py-3 border border-charcoal/15 bg-white text-charcoal font-body text-sm focus:outline-none focus:border-berkeley-blue transition-colors"

  return (
    <div className="bg-off-white min-h-screen flex items-center justify-center py-20">
      <div className="w-full max-w-md px-6">
        {/* Bk badge */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-20 border-2 border-berkeley-blue/15 flex flex-col items-center justify-center">
            <span className="text-[7px] text-berkeley-blue/30 font-body tracking-[0.2em]">
              97
            </span>
            <span className="text-2xl font-heading font-bold text-berkeley-blue leading-none">
              Bk
            </span>
          </div>
        </div>

        <h1 className="font-heading text-2xl text-charcoal text-center mb-2">
          Create Account
        </h1>
        <p className="text-sm text-charcoal/50 font-body text-center mb-8">
          Join the element.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First name"
              required
              value={form.first_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, first_name: e.target.value }))
              }
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Last name"
              required
              value={form.last_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, last_name: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase py-4 hover:bg-berkeley-blue/90 transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-charcoal/50 font-body text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="text-berkeley-blue hover:text-california-gold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
