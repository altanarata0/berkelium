import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceContext,
  CreateFulfillmentResult,
  FulfillmentOption,
  ValidateFulfillmentDataContext,
} from "@medusajs/types"

type PrintfulOptions = {
  apiKey: string
}

type InjectedDependencies = Record<string, unknown>

export class PrintfulFulfillmentService extends AbstractFulfillmentProviderService {
  static identifier = "printful"

  protected options_: PrintfulOptions
  protected baseUrl_ = "https://api.printful.com"

  constructor(container: InjectedDependencies, options: PrintfulOptions) {
    super()
    this.options_ = options
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      { id: "printful-standard" },
      { id: "printful-express" },
    ]
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<Record<string, unknown>> {
    return data
  }

  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    return true
  }

  async canCalculate(): Promise<boolean> {
    // Printful calculates shipping based on destination — we use fixed pricing for now
    return false
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: CalculateShippingOptionPriceContext
  ): Promise<CalculatedShippingOptionPrice> {
    throw new Error("Printful fulfillment uses fixed shipping prices")
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: Record<string, unknown>,
    order: Record<string, unknown>,
    fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    // Map Medusa line items to Printful order items
    const lineItems = (items as any[]) || []

    const printfulItems = lineItems.map((item: any) => ({
      variant_id: item.variant?.metadata?.printful_variant_id,
      quantity: item.quantity,
      name: item.title,
    }))

    const shippingAddress = (order as any).shipping_address || {}

    const printfulOrder = {
      recipient: {
        name: shippingAddress.first_name + " " + shippingAddress.last_name,
        address1: shippingAddress.address_1,
        address2: shippingAddress.address_2 || "",
        city: shippingAddress.city,
        state_code: shippingAddress.province,
        country_code: shippingAddress.country_code?.toUpperCase(),
        zip: shippingAddress.postal_code,
        email: (order as any).email,
      },
      items: printfulItems,
    }

    try {
      const response = await fetch(`${this.baseUrl_}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.options_.apiKey}`,
        },
        body: JSON.stringify(printfulOrder),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          `Printful API error: ${result.error?.message || response.statusText}`
        )
      }

      return {
        data: {
          printful_order_id: result.result?.id,
          printful_status: result.result?.status,
        },
        labels: [],
      }
    } catch (error: any) {
      // In development/sandbox, log and return a mock if API key is placeholder
      if (this.options_.apiKey?.includes("placeholder")) {
        return {
          data: {
            printful_order_id: `mock_${Date.now()}`,
            printful_status: "draft",
          },
          labels: [],
        }
      }
      throw error
    }
  }

  async cancelFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const printfulOrderId = (fulfillment as any).data?.printful_order_id

    if (printfulOrderId && !printfulOrderId.startsWith("mock_")) {
      await fetch(`${this.baseUrl_}/orders/${printfulOrderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.options_.apiKey}`,
        },
      })
    }

    return {}
  }

  async createReturnFulfillment(): Promise<CreateFulfillmentResult> {
    // Printful handles returns through their dashboard
    return {
      data: {},
      labels: [],
    }
  }
}
