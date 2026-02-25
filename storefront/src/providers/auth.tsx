"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { sdk } from "@/lib/sdk"

type Customer = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

type AuthContextType = {
  customer: Customer | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    first_name: string
    last_name: string
  }) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { customer: data } = await sdk.store.customer.retrieve()
      setCustomer(data as unknown as Customer)
    } catch {
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true)
      try {
        await sdk.auth.login("customer", "emailpass", {
          email,
          password,
        })
        await refresh()
      } finally {
        setLoading(false)
      }
    },
    [refresh]
  )

  const register = useCallback(
    async (data: {
      email: string
      password: string
      first_name: string
      last_name: string
    }) => {
      setLoading(true)
      try {
        await sdk.auth.register("customer", "emailpass", {
          email: data.email,
          password: data.password,
        })
        // After auth registration, create the customer record
        await sdk.store.customer.create({
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        })
        await refresh()
      } finally {
        setLoading(false)
      }
    },
    [refresh]
  )

  const logout = useCallback(async () => {
    try {
      await sdk.auth.logout()
    } catch {
      // ignore
    }
    setCustomer(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ customer, loading, login, register, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
