import { sdk } from "./sdk"

export async function getProducts(limit = 12, categoryId?: string) {
  try {
    const params: Record<string, unknown> = {
      limit,
      fields:
        "+variants,+variants.prices,+images,+categories",
    }
    if (categoryId) {
      params.category_id = [categoryId]
    }
    const { products } = await sdk.store.product.list(params)
    return products
  } catch {
    return []
  }
}

export async function getProduct(handle: string) {
  try {
    const { products } = await sdk.store.product.list({
      handle,
      fields:
        "+variants,+variants.prices,+variants.options,+images,+categories,+options,+options.values",
    })
    return products[0] || null
  } catch {
    return null
  }
}

export async function getCategories() {
  try {
    const { product_categories } = await sdk.store.category.list({
      fields: "+products",
    })
    return product_categories
  } catch {
    return []
  }
}
