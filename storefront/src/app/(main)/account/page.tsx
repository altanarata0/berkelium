"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/providers/auth"
import { sdk } from "@/lib/sdk"
import { formatPrice } from "@/lib/utils"

export default function AccountPage() {
  const router = useRouter()
  const { customer, loading: authLoading, logout } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders")

  useEffect(() => {
    if (!authLoading && !customer) {
      router.push("/account/login")
    }
  }, [customer, authLoading, router])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { orders: data } = await sdk.store.order.list({
          fields: "+items,+items.variant",
        })
        setOrders(data || [])
      } catch {
        // not logged in or no orders
      } finally {
        setLoadingOrders(false)
      }
    }
    if (customer) fetchOrders()
  }, [customer])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (authLoading || !customer) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-berkeley-blue/20 border-t-berkeley-blue rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-off-white min-h-screen">
      {/* Header */}
      <div className="bg-berkeley-blue py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-xs font-body tracking-[0.4em] uppercase text-california-gold/60 mb-3 block">
            My Account
          </span>
          <h1 className="font-heading text-4xl md:text-5xl text-off-white">
            {customer.first_name
              ? `Welcome, ${customer.first_name}`
              : "Your Account"}
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-charcoal/10">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 text-xs font-body tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
              activeTab === "orders"
                ? "border-berkeley-blue text-berkeley-blue"
                : "border-transparent text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 text-xs font-body tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
              activeTab === "profile"
                ? "border-berkeley-blue text-berkeley-blue"
                : "border-transparent text-charcoal/40 hover:text-charcoal/60"
            }`}
          >
            Profile
          </button>
        </div>

        {/* Orders tab */}
        {activeTab === "orders" && (
          <div>
            {loadingOrders ? (
              <div className="text-center py-16">
                <div className="w-6 h-6 border-2 border-berkeley-blue/20 border-t-berkeley-blue rounded-full animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-20 border-2 border-berkeley-blue/10 flex flex-col items-center justify-center mx-auto mb-4">
                  <span className="text-[7px] text-berkeley-blue/15 font-body tracking-[0.2em]">
                    97
                  </span>
                  <span className="text-xl font-heading font-bold text-berkeley-blue/10 leading-none">
                    Bk
                  </span>
                </div>
                <p className="text-charcoal/50 font-body mb-4">
                  No orders yet.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-berkeley-blue text-off-white font-body text-sm tracking-[0.3em] uppercase px-8 py-3 hover:bg-berkeley-blue/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="bg-white border border-charcoal/5 p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <span className="text-xs font-body tracking-[0.2em] uppercase text-charcoal/40">
                          Order
                        </span>
                        <p className="font-body text-sm text-charcoal">
                          {order.display_id
                            ? `#${order.display_id}`
                            : order.id.slice(0, 16)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs font-body tracking-[0.15em] uppercase px-3 py-1 ${
                            order.fulfillment_status === "fulfilled"
                              ? "bg-green-50 text-green-700"
                              : order.fulfillment_status === "shipped"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-charcoal/5 text-charcoal/50"
                          }`}
                        >
                          {order.fulfillment_status || "Processing"}
                        </span>
                        <span className="font-heading text-lg text-charcoal">
                          {formatPrice(order.total || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex gap-2 flex-wrap">
                      {(order.items || [])
                        .slice(0, 4)
                        .map((item: any, i: number) => (
                          <div
                            key={i}
                            className="w-12 h-14 bg-off-white flex items-center justify-center"
                          >
                            <span className="text-xs font-heading text-berkeley-blue/15">
                              Bk
                            </span>
                          </div>
                        ))}
                      {(order.items?.length || 0) > 4 && (
                        <div className="w-12 h-14 bg-off-white flex items-center justify-center">
                          <span className="text-xs font-body text-charcoal/40">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-charcoal/5 text-xs text-charcoal/40 font-body">
                      {order.created_at &&
                        new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="max-w-lg">
            <div className="bg-white border border-charcoal/5 p-6 mb-6">
              <h3 className="text-xs font-body tracking-[0.3em] uppercase text-charcoal/50 mb-4">
                Account Details
              </h3>
              <div className="space-y-3 text-sm font-body">
                <div>
                  <span className="text-charcoal/40 block text-xs mb-1">
                    Name
                  </span>
                  <span className="text-charcoal">
                    {customer.first_name || ""} {customer.last_name || ""}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal/40 block text-xs mb-1">
                    Email
                  </span>
                  <span className="text-charcoal">{customer.email}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full border-2 border-charcoal/15 text-charcoal/60 font-body text-sm tracking-[0.3em] uppercase py-3 hover:border-red-300 hover:text-red-600 transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
