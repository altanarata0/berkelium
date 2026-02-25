"use client"

import { useState } from "react"
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
)

type StripePaymentFormProps = {
  clientSecret: string
  onSuccess: () => void
  onError: (msg: string) => void
  loading?: boolean
}

function PaymentForm({
  clientSecret,
  onSuccess,
  onError,
  loading: externalLoading,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    )

    if (error) {
      onError(error.message || "Payment failed")
      setProcessing(false)
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-charcoal/15 bg-white px-4 py-4 mb-6">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                color: "#1A1A1A",
                "::placeholder": { color: "#1A1A1A80" },
              },
              invalid: { color: "#dc2626" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || externalLoading}
        className="w-full bg-california-gold text-berkeley-blue font-body text-sm tracking-[0.3em] uppercase py-4 hover:bg-california-gold/90 transition-colors duration-300 font-semibold disabled:opacity-50"
      >
        {processing ? "Processing..." : "Place Order"}
      </button>
    </form>
  )
}

type StripePaymentProps = {
  clientSecret: string
  onSuccess: () => void
  onError: (msg: string) => void
}

export function StripePayment({
  clientSecret,
  onSuccess,
  onError,
}: StripePaymentProps) {
  if (!clientSecret) {
    return (
      <p className="text-charcoal/50 font-body text-sm">
        Initializing payment...
      </p>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "flat" } }}
    >
      <PaymentForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  )
}
