import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://berkelium.com"
  ),
  title: {
    default: "Bk — Berkelium Apparel",
    template: "%s | Bk",
  },
  description:
    "Element 97. The university rejected this mark, so we made it ourselves. Hoodies, tees, and hats.",
  openGraph: {
    title: "Bk — Berkelium Apparel",
    description: "Element 97. Wear the mark Berkeley rejected.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
