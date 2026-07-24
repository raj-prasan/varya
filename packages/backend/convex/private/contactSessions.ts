import { ConvexError, v } from "convex/values"
import { query } from "../_generated/server"

export const getOneByConversationId = query({
  args: {
    conversationId: v.id("conversations"),
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
    const conversation = await ctx.db.get(args.conversationId)
    if (!conversation) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Conversation not found",
      })
    }
    if (conversation?.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Invalid Organization Id",
      })
    }

    const contactSession = await ctx.db.get(conversation.contactSessionId);

    return contactSession;
  },
})
