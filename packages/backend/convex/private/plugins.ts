import { ConvexError, v } from "convex/values"
import { mutation, query } from "../_generated/server"

export const getOne = query({
  args: {
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
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
    return await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service)
      )
      .unique()
  },
})
export const remove = mutation({
  args: {
    service: v.union(v.literal("vapi")),
  },
  handler: async (ctx, args) => {
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
    const existingPlugin = await ctx.db
      .query("plugins")
      .withIndex("by_organization_id_and_service", (q) =>
        q.eq("organizationId", orgId).eq("service", args.service)
      )
      .unique()
    if (!existingPlugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Plugin not found",
      })
    }

    await ctx.db.delete(existingPlugin._id);
  },
})
