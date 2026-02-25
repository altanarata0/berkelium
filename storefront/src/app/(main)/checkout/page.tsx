"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/providers/cart"
import { sdk } from "@/lib/sdk"
import { ShippingForm } from "@/components/checkout/ShippingForm"
import { StripePayment } from "@/components/checkout/StripePayment"
import { OrderReview } from "@/components/checkout/OrderReview"
import { cn } from "@/lib/utils"

type Step = "contact" | "shipping" | "payment"

const STEPS: { key: Step; label: string }[] = [
  { key: "contact", label: "Contact" },
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, refreshCart } = useCart()
  const [step, setStep] = useState<Step>("contact")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [shippingOptions, setShippingOptions] = useState<any[]>([])
  const [selectedShipping, setSelectedShipping] = useState("")

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart?.items?.length && !loading) {
      // Give cart a moment to load
      const t = setTimeout(() => {
        if (!cart?.items?.length) router.push("/cart")
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [cart, loading, router])

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cart || !email) return
    setLoading(true)
    setError("")
    try {
      await sdk.store.cart.update(cart.id, { email })
      await refreshCart()
      setStep("shipping")
    } catch (err: any) {
      setError(err.message || "Failed to save email")
    } finally {
      setLoading(false)
    }
  }

  const handleShippingSubmit = async (address: any) => {
    if (!cart) return
    setLoading(true)
    setError("")
    try {
      await sdk.store.cart.update(cart.id, {
        shipping_address: address,
        billing_address: address,
      })

      // Fetch shipping options
      const { shipping_options } =
        await sdk.store.fulfillment.listCartOptions({ cart_id: cart.id })
      setShippingOptions(shipping_options || [])

      if (shipping_options?.length) {
        // Auto-select the first option
        const firstOption = shipping_options[0]
        setSelectedShipping(firstOption.id)
        await sdk.store.cart.addShippingMethod(cart.id, {
          option_id: firstOption.id,
        })
      }

      await refreshCart()
      setStep("payment")

      // Initialize payment session
      await sdk.store.payment.initiatePaymentSession(cart as any, {
        provider_id: "pp_stripe_stripe",
      })
      await refreshCart()

      // Get client secret from payment sessions
      const { cart: freshCart } = await sdk.store.cart.retrieve(cart.id, {
        fields: "+payment_collection.payment_sessions",
      })
      const sessions = (freshCart as any).payment_collection?.payment_sessions
      if (sessions?.length) {
        const stripeSession = sessions.find(
          (s: any) => s.provider_id === "pp_stripe_stripe"
        )
        if (stripeSession?.data?.client_secret) {
          setClientSecret(stripeSession.data.client_secret)
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to set shipping")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    if (!cart) return
    try {
      await sdk.store.cart.complete(cart.id)
      localStorage.removeItem("bk_cart_id")
      router.push(`/order/confirmed?id=${cart.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to complete order")
    }
  }

  const handlePaymentError = (msg: string) => {
    setError(msg)
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step)

  return (
    <div className="bg-off-white min-h-screen">
      {/* Header */}
      <div className="bg-berkeley-blue py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold/60 mb-3 block">
            Secure Checkout
          </span>
          <h1 className="font-heading text-3xl md:text-4xl text-off-white">
            Checkout
          </h1>

          {/* Step indicators */}
          <div className="flex items-center gap-4 mt-6">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-4">
                {i > 0 && (
                  <div
                    className={cn(
                      "w-8 h-px",
                      i <= stepIndex
                        ? "bg-california-gold"
                        : "bg-off-white/20"
                    )}
                  />
                )}
                <button
                  onClick={() => i < stepIndex && setStep(s.key)}
                  disabled={i > stepIndex}
                  className={cn(
                    "flex items-center gap-2 text-xs font-body tracking-[0.2em] uppercase transition-colors",
                    i === stepIndex
                      ? "text-california-gold"
                      : i < stepIndex
                        ? "text-off-white/60 cursor-pointer hover:text-off-white"
                        : "text-off-white/20 cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "w-6 h-6 flex items-center justify-center text-[10px] border",
                      i === stepIndex
                        ? "border-california-gold text-california-gold"
                        : i < stepIndex
                          ? "border-off-white/40 text-off-white/60"
                          : "border-off-white/20 text-off-white/20"
                    )}
                  >
                    {i < stepIndex ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm font-body mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Form area */}
          <div className="md:col-span-3">
            {/* Contact step */}
            {step === "contact" && (
              <div>
                <h2 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-6">
                  Contact Information
                </h2>
                <form onSubmit={handleContactSubmit}>
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-charcoal/15 bg-white text-charcoal font-body text-sm focus:outline-none focus:border-berkeley-blue transition-colors mb-4"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase py-4 hover:bg-berkeley-blue/90 transition-colors duration-300 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Continue to Shipping"}
                  </button>
                </form>
              </div>
            )}

            {/* Shipping step */}
            {step === "shipping" && (
              <div>
                <h2 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-6">
                  Shipping Address
                </h2>
                <ShippingForm onSubmit={handleShippingSubmit} loading={loading} />
              </div>
            )}

            {/* Payment step */}
            {step === "payment" && (
              <div>
                {/* Shipping option selector */}
                {shippingOptions.length > 1 && (
                  <div className="mb-8">
                    <h2 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-4">
                      Shipping Method
                    </h2>
                    <div className="space-y-2">
                      {shippingOptions.map((opt: any) => (
                        <label
                          key={opt.id}
                          className={cn(
                            "flex items-center justify-between border px-4 py-3 cursor-pointer transition-colors",
                            selectedShipping === opt.id
                              ? "border-berkeley-blue bg-berkeley-blue/5"
                              : "border-charcoal/15 hover:border-charcoal/30"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={opt.id}
                              checked={selectedShipping === opt.id}
                              onChange={async () => {
                                setSelectedShipping(opt.id)
                                if (cart) {
                                  await sdk.store.cart.addShippingMethod(
                                    cart.id,
                                    { option_id: opt.id }
                                  )
                                  await refreshCart()
                                }
                              }}
                              className="accent-berkeley-blue"
                            />
                            <div>
                              <span className="text-sm font-body text-charcoal">
                                {opt.name}
                              </span>
                              {opt.type?.description && (
                                <p className="text-xs text-charcoal/50">
                                  {opt.type.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-body text-charcoal/70">
                            {opt.amount ? `$${(opt.amount / 100).toFixed(2)}` : "Free"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-6">
                  Payment
                </h2>

                {clientSecret ? (
                  <StripePayment
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <div className="text-sm font-body text-charcoal/50 py-8 text-center">
                    <div className="inline-block w-5 h-5 border-2 border-berkeley-blue/20 border-t-berkeley-blue rounded-full animate-spin mb-3" />
                    <p>Initializing secure payment...</p>
                  </div>
                )}

                <p className="text-xs text-charcoal/40 font-body mt-4 text-center">
                  Test card: 4242 4242 4242 4242 &middot; Any future date &middot;
                  Any CVC
                </p>
              </div>
            )}
          </div>

          {/* Order review sidebar */}
          <div className="md:col-span-2">
            <OrderReview cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}
