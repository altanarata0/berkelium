"use client"

import { useState } from "react"

type Address = {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
}

type ShippingFormProps = {
  onSubmit: (address: Address) => void
  loading?: boolean
  initial?: Partial<Address>
}

export function ShippingForm({ onSubmit, loading, initial }: ShippingFormProps) {
  const [address, setAddress] = useState<Address>({
    first_name: initial?.first_name || "",
    last_name: initial?.last_name || "",
    address_1: initial?.address_1 || "",
    address_2: initial?.address_2 || "",
    city: initial?.city || "",
    province: initial?.province || "",
    postal_code: initial?.postal_code || "",
    country_code: initial?.country_code || "us",
    phone: initial?.phone || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(address)
  }

  const inputClass =
    "w-full px-4 py-3 border border-charcoal/15 bg-white text-charcoal font-body text-sm focus:outline-none focus:border-berkeley-blue transition-colors"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First name"
          required
          value={address.first_name}
          onChange={(e) =>
            setAddress((a) => ({ ...a, first_name: e.target.value }))
          }
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Last name"
          required
          value={address.last_name}
          onChange={(e) =>
            setAddress((a) => ({ ...a, last_name: e.target.value }))
          }
          className={inputClass}
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        required
        value={address.address_1}
        onChange={(e) =>
          setAddress((a) => ({ ...a, address_1: e.target.value }))
        }
        className={inputClass}
      />

      <input
        type="text"
        placeholder="Apartment, suite, etc. (optional)"
        value={address.address_2}
        onChange={(e) =>
          setAddress((a) => ({ ...a, address_2: e.target.value }))
        }
        className={inputClass}
      />

      <div className="grid grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="City"
          required
          value={address.city}
          onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="State"
          required
          value={address.province}
          onChange={(e) =>
            setAddress((a) => ({ ...a, province: e.target.value }))
          }
          className={inputClass}
        />
        <input
          type="text"
          placeholder="ZIP"
          required
          value={address.postal_code}
          onChange={(e) =>
            setAddress((a) => ({ ...a, postal_code: e.target.value }))
          }
          className={inputClass}
        />
      </div>

      <input
        type="tel"
        placeholder="Phone (optional)"
        value={address.phone}
        onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))}
        className={inputClass}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase py-4 hover:bg-berkeley-blue/90 transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue to Payment"}
      </button>
    </form>
  )
}
