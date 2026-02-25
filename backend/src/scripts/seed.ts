import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => ({
              currency_code: currency.currency_code,
              is_default: currency.is_default ?? false,
            })
          ),
        },
      };
    });
    const stores = updateStoresStep(normalizedInput);
    return new WorkflowResponse(stores);
  }
);

// Helper to generate size variants for a product
function generateVariants(
  skuPrefix: string,
  sizes: string[],
  color: string,
  priceUsd: number,
  printfulVariantIds: Record<string, number>
) {
  return sizes.map((size) => ({
    title: `${size} / ${color}`,
    sku: `${skuPrefix}-${size}-${color.toUpperCase()}`,
    options: { Size: size, Color: color },
    manage_inventory: true,
    metadata: {
      printful_variant_id: printfulVariantIds[`${size}-${color}`] || 0,
    },
    prices: [{ amount: priceUsd * 100, currency_code: "usd" }],
  }));
}

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // ── Store ──────────────────────────────────────────────────────────
  logger.info("Seeding Berkelium store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [{ name: "Default Sales Channel" }],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "usd", is_default: true },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
        name: "Berkelium",
      },
    },
  });

  // ── Region (US only) ──────────────────────────────────────────────
  logger.info("Seeding US region...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United States",
          currency_code: "usd",
          countries: ["us"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];

  // ── Tax ────────────────────────────────────────────────────────────
  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "us", provider_id: "tp_system" }],
  });

  // ── Stock Location ────────────────────────────────────────────────
  logger.info("Seeding stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Printful Warehouse",
          address: {
            city: "Los Angeles",
            country_code: "US",
            address_1: "19749 Dearborn St",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: { default_location_id: stockLocation.id },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  });

  // ── Shipping ──────────────────────────────────────────────────────
  logger.info("Seeding fulfillment data...");
  const shippingProfiles =
    await fulfillmentModuleService.listShippingProfiles({ type: "default" });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [{ name: "Default Shipping Profile", type: "default" }],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "US Shipping",
    type: "shipping",
    service_zones: [
      {
        name: "United States",
        geo_zones: [{ country_code: "us", type: "country" }],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivered in 5-8 business days.",
          code: "standard",
        },
        prices: [
          { currency_code: "usd", amount: 599 },
          { region_id: region.id, amount: 599 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivered in 2-3 business days.",
          code: "express",
        },
        prices: [
          { currency_code: "usd", amount: 1299 },
          { region_id: region.id, amount: 1299 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // ── Publishable API key ───────────────────────────────────────────
  logger.info("Seeding publishable API key...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: { type: "publishable" },
  });
  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          { title: "Storefront", type: "publishable", created_by: "" },
        ],
      },
    });
    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // ── Categories ────────────────────────────────────────────────────
  logger.info("Seeding product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Hoodies", is_active: true },
        { name: "Tees", is_active: true },
        { name: "Hats", is_active: true },
      ],
    },
  });

  // ── Products ──────────────────────────────────────────────────────
  logger.info("Seeding Berkelium products...");

  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Printful variant ID placeholders — replace with real catalog IDs
  const printfulHoodieIds: Record<string, number> = {};
  const printfulTeeIds: Record<string, number> = {};

  sizes.forEach((s, i) => {
    printfulHoodieIds[`${s}-Berkeley Blue`] = 10000 + i;
    printfulHoodieIds[`${s}-California Gold`] = 10100 + i;
    printfulTeeIds[`${s}-White`] = 20000 + i;
    printfulTeeIds[`${s}-Berkeley Blue`] = 20100 + i;
    printfulTeeIds[`${s}-California Gold`] = 20200 + i;
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        // ─── Bk Classic Hoodie ──────────────────────────────────────
        {
          title: "Bk Classic Hoodie",
          handle: "bk-classic-hoodie",
          description:
            "Element 97. Premium heavyweight hoodie with the Bk mark embroidered in California Gold on Berkeley Blue, or Berkeley Blue on California Gold. 80/20 cotton-poly blend.",
          category_ids: [
            categoryResult.find((c) => c.name === "Hoodies")!.id,
          ],
          weight: 600,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://placehold.co/800x1000/003262/FDB515?text=Bk+Hoodie+Front" },
            { url: "https://placehold.co/800x1000/003262/FDB515?text=Bk+Hoodie+Back" },
          ],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: ["Berkeley Blue", "California Gold"] },
          ],
          variants: [
            ...generateVariants("BK-HOOD", sizes, "Berkeley Blue", 68, printfulHoodieIds),
            ...generateVariants("BK-HOOD", sizes, "California Gold", 68, printfulHoodieIds),
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },

        // ─── Bk Element Tee ────────────────────────────────────────
        {
          title: "Bk Element Tee",
          handle: "bk-element-tee",
          description:
            "The periodic table never looked this good. Soft-washed 100% cotton tee featuring the Bk mark. Element 97, discovered at UC Berkeley, 1949.",
          category_ids: [
            categoryResult.find((c) => c.name === "Tees")!.id,
          ],
          weight: 250,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://placehold.co/800x1000/F5F5F0/003262?text=Bk+Tee+Front" },
            { url: "https://placehold.co/800x1000/F5F5F0/003262?text=Bk+Tee+Back" },
          ],
          options: [
            { title: "Size", values: sizes },
            { title: "Color", values: ["White", "Berkeley Blue", "California Gold"] },
          ],
          variants: [
            ...generateVariants("BK-TEE", sizes, "White", 38, printfulTeeIds),
            ...generateVariants("BK-TEE", sizes, "Berkeley Blue", 38, printfulTeeIds),
            ...generateVariants("BK-TEE", sizes, "California Gold", 38, printfulTeeIds),
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },

        // ─── Bk Dad Hat ────────────────────────────────────────────
        {
          title: "Bk Dad Hat",
          handle: "bk-dad-hat",
          description:
            "Unstructured six-panel dad hat with the Bk mark embroidered front-center. Adjustable strap. One size fits most.",
          category_ids: [
            categoryResult.find((c) => c.name === "Hats")!.id,
          ],
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://placehold.co/800x800/003262/FDB515?text=Bk+Hat+Front" },
            { url: "https://placehold.co/800x800/003262/FDB515?text=Bk+Hat+Side" },
          ],
          options: [
            { title: "Color", values: ["Berkeley Blue", "California Gold", "White"] },
          ],
          variants: [
            {
              title: "Berkeley Blue",
              sku: "BK-HAT-BLUE",
              options: { Color: "Berkeley Blue" },
              manage_inventory: true,
              metadata: { printful_variant_id: 30001 },
              prices: [{ amount: 3200, currency_code: "usd" }],
            },
            {
              title: "California Gold",
              sku: "BK-HAT-GOLD",
              options: { Color: "California Gold" },
              manage_inventory: true,
              metadata: { printful_variant_id: 30002 },
              prices: [{ amount: 3200, currency_code: "usd" }],
            },
            {
              title: "White",
              sku: "BK-HAT-WHITE",
              options: { Color: "White" },
              manage_inventory: true,
              metadata: { printful_variant_id: 30003 },
              prices: [{ amount: 3200, currency_code: "usd" }],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding products.");

  // ── Inventory ─────────────────────────────────────────────────────
  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map(
    (item) => ({
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: item.id,
    })
  );

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  });

  logger.info("Finished seeding Berkelium store. 🧪");
}
