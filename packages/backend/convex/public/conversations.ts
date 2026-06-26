import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

export const getOne = query({
    args: {
        conversationId: v.id("conversations"),
        contactSessionId: v.id("contactSessions")
    },
    handler :async(ctx,args) =>{

        const session = await ctx.db.get("contactSessions", args.contactSessionId);
        if(!session || session.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTORIZED",
                message: "Invalid Session."
            })
        }
        const conversation = await ctx.db.get(args.conversationId);

        if(!conversation){
            throw new ConvexError({
                code: "UNAUTORIZED",
                message: "Conversation not found."
            })
        }
        if(conversation.contactSessionId !== session._id){
            throw new ConvexError({
                code: "UNAUTORIZED",
                message: "Incorrect Session."
            })
        }

        return {
            _id: conversation._id,
            status: conversation.status,
            threadId: conversation.threadId
        }
    }
})

export const create = mutation({
    args: {
        organizationId : v.string(),
        contactSessionId: v.id("contactSessions")
    },
    handler: async (ctx, args)=>{
        const session = await ctx.db.get(args.contactSessionId);
        console.log(session);
        console.log(args.organizationId)

        if(!session || session.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTORIZED",
                message: "Invalid Session."
            })
        }
        const threadId = "123"
        const conversationId = await ctx.db.insert("conversations",{
            organizationId: args.organizationId,
            contactSessionId: session._id,
            status: "unresolved",
            threadId
        })
        return conversationId
    }
})