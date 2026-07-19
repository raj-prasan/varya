import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { internal } from "../_generated/api"

export const upsert = mutation({
  args: {
    service: v.union(v.literal("vapi")),
    value: v.any(),
  },
  handler: async (ctx, args) => {
    console.log(1)
    const identity = await ctx.auth.getUserIdentity()

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Identity not found",
      })
    }
    const organization = identity.o

    const orgId =
      typeof organization === "object" &&
      organization !== null &&
      !Array.isArray(organization) &&
      "id" in organization &&
      typeof organization.id === "string"
        ? organization.id
        : undefined

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Organization not found",
      })
    }

    //TODO:Check for subscription

    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert,{
      service: args.service,
      organizationId: orgId,
      value: args.value
    })
  },
})
