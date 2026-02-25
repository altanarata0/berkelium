"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { sdk } from "@/lib/sdk"

type LineItem = {
  id: string
  title: string
  quantity: number
  unit_price: number
  variant: {
    id: string
    title: string
    product: {
      title: string
      thumbnail: string | null
      handle: string
    }
  }
  thumbnail: string | null
}

type Cart = {
  id: string
  items: LineItem[]
  total: number
  subtotal: number
  shipping_total: number
  tax_total: number
  region_id: string
  shipping_address?: Record<string, string>
  email?: string
}

type CartContextType = {
  cart: Cart | null
  loading: boolean
  itemCount: number
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const CART_ID_KEY = "bk_cart_id"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      const cartId = localStorage.getItem(CART_ID_KEY)
      if (!cartId) {
        setLoading(false)
        return
      }
      const { cart: data } = await sdk.store.cart.retrieve(cartId, {
        fields:
          "+items,+items.variant,+items.variant.product,+items.thumbnail",
      })
      setCart(data as unknown as Cart)
    } catch {
      localStorage.removeItem(CART_ID_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const getOrCreateCart = useCallback(async () => {
    let cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) {
      const { cart: newCart } = await sdk.store.cart.create({ region_id: "" })
      cartId = newCart.id
      localStorage.setItem(CART_ID_KEY, cartId)
    }
    return cartId
  }, [])

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true)
      try {
        const cartId = await getOrCreateCart()
        await sdk.store.cart.createLineItem(cartId, {
          variant_id: variantId,
          quantity,
        })
        await refreshCart()
      } finally {
        setLoading(false)
      }
    },
    [getOrCreateCart, refreshCart]
  )

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return
      setLoading(true)
      try {
        await sdk.store.cart.updateLineItem(cart.id, lineItemId, { quantity })
        await refreshCart()
      } finally {
        setLoading(false)
      }
    },
    [cart, refreshCart]
  )

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return
      setLoading(true)
      try {
        await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
        await refreshCart()
      } finally {
        setLoading(false)
      }
    },
    [cart, refreshCart]
  )

  const itemCount = useMemo(
    () => cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [cart]
  )

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
