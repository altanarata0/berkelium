import { getProduct, getProducts } from "@/lib/data"
import { notFound } from "next/navigation"
import { ProductDetail } from "./product-detail"
import type { Metadata } from "next"

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) return {}
  return {
    title: product.title,
    description: product.description,
  }
}

export async function generateStaticParams() {
  const products = await getProducts(50)
  return products.map((p: any) => ({ handle: p.handle }))
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) notFound()

  return (
    <div className="bg-off-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <ProductDetail product={product} />
      </div>
    </div>
  )
}
