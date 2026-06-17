import { query, mutation } from "./_generated/server"
export const getMany = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect()
  },
})

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (identity === null) {
      throw new Error("Not authenticated")
    }
    const userId = await ctx.db.insert("users", {
      name: "New user Added",
    })
    return userId
  },
})
