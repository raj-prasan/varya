import { google } from "@ai-sdk/google"
import { createTool } from "@convex-dev/agent"
import { generateText } from "ai"
import z from "zod"
import { internal } from "../../../_generated/api"
import { supportAgent } from "../agents/supportAgent"
import rag from "../rag"
import { SEARCH_INTERPRETER_PROMPT } from "../../../constants"

export const search = createTool({
  description:
    "Search the kknowledge base for relevant informaation to help answer the user's question",
  title: "resolve_convversation",
  inputSchema: z.object({
    query: z.string().describe("The search query to find relevant information"),
  }),
  execute: async (ctx, args) => {
    if (!ctx.threadId) {
      return "Misssing Thread ID"
    }

    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: ctx.threadId,
      }
    )
    if (!conversation) {
      return "Conversation not found"
    }
    const orgId = conversation.organizationId

    const searchResult = await rag.search(ctx, {
      namespace: orgId,
      query: args.query,
      limit: 5,
    })

    const contextText = `Found result in ${searchResult.entries
      .map((entry) => entry.title || null)
      .filter((t) => t !== null)
      .join(", ")},Here is the content:\n\n${searchResult.text}`

      const response = await generateText({
        model: google("gemini-3.1-flash-lite"),
        system: SEARCH_INTERPRETER_PROMPT,
        messages :[
          {
            role: "user",
            content: `User asked : ${args.query}\n\n Search results: ${contextText} `
          }
        ]
      })
      await supportAgent.saveMessage(ctx,{
        threadId: ctx.threadId,
        message:{
          role: "assistant",
          content : response.text
        }
      }) 
      return response.text
      
  },
})
