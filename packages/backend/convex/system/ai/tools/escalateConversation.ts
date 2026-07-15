import { createTool } from "@convex-dev/agent"
import { z } from "zod"
import { supportAgent } from "../agents/supportAgent"
import { internal } from "../../../_generated/api"

export const escalateConversation = createTool({
  description: "Escalate a convesation",
  title: "resolve_convversation",
  inputSchema: z.object({}),
  execute: async (ctx) => {
    if (!ctx.threadId) {
      return "Misssing  Thread ID"
    }
    await ctx.runMutation(internal.system.conversations.resolve, {
      threadId: ctx.threadId,
    })

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to Customer Support Team ",
      },
    });

    return "Conversation escalated to Customer Support Team "
  },
})
