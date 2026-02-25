import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://berkelium.com"

  const products = await getProducts(100)
  const productUrls: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${baseUrl}/shop/${p.handle}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ]
}
