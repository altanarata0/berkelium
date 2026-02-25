"use client"

import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { CartProvider } from "@/providers/cart"
import { AuthProvider } from "@/providers/auth"
import { ToastProvider } from "@/components/ui/Toast"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  )
}
