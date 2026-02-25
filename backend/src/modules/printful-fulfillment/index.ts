import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { PrintfulFulfillmentService } from "./service"

const services = [PrintfulFulfillmentService]

export default ModuleProvider(Modules.FULFILLMENT, {
  services,
})
