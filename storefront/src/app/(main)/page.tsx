import { getProducts } from "@/lib/data"
import { HomeContent } from "@/components/home/HomeContent"

export default async function HomePage() {
  const products = await getProducts(3)

  return <HomeContent products={products} />
}
