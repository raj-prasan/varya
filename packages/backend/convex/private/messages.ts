import { ConvexError, v } from "convex/values"
import { action, mutation, query } from "../_generated/server"
import { components, internal } from "../_generated/api"
import { generateText } from "ai"
import { supportAgent } from "../system/ai/agents/supportAgent"
import { paginationOptsValidator } from "convex/server"
import { saveMessage } from "@convex-dev/agent"
import { google } from "@ai-sdk/google"
import { OPERATOR_MESSAGE_ENHANCEMENT_PROMPT } from "../constants"

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
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

    const response = await generateText({
      model: google("gemini-2.5-flash-lite"),
      messages: [
        {
          role: "system",
          content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT,
        },
        {
          role: "user",
          content: args.prompt,
        },
      ],
    })
    return response.text
  },
})

export const create = mutation({
  args: {
    prompt: v.string(),
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
        code: "NOT_FOUND",
        message: "Convrsation not found.",
      })
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Organization do not match",
      })
    }

    if (conversation.status === "resolved") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Convrsation Resolved",
      })
    }
    if (conversation.status === "unresolved") {
      await ctx.db.patch(conversation._id, {
        status: "escalated",
      })
    }

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      //CHECK : Check if agent name is needed
      agentName: identity.familyName,
      message: {
        role: "assistant",
        content: args.prompt,
      },
    })
  },
})

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
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
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique()

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      })
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNAUTORIZED",
        message: "Organization do not match",
      })
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts,
    })
    return paginated
  },
})
