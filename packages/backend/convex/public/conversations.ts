import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { MessageDoc, saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { paginationOptsValidator } from "convex/server";


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

export const getMany = query({
    args: {
        contactSessionId: v.id("contactSessions"),
        paginationOpts: paginationOptsValidator
    },
    handler :async(ctx,args)=>{
        const session = await ctx.db.get(args.contactSessionId);

        if(!session || session.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTORIZED",
                message: "Invalid Session."
            })
        }
        const conversations = await ctx.db.query("conversations")
        .withIndex("by_contact_session_id", (q)=> q.eq("contactSessionId", args.contactSessionId)).order("desc").paginate(args.paginationOpts);

        const conversationsWithLastMessage = await Promise.all(
            conversations.page.map(async(conversation)=>{
                let lastMessage : MessageDoc | null = null;
                const message = await supportAgent.listMessages(ctx, 
                    {threadId: conversation.threadId,
                    paginationOpts: {numItems: 1, cursor: null}, 
                    }
                )
                if(message.page.length > 0){
                    lastMessage = message.page[0]?? null;
                }
                return {
                    _id: conversation._id,
                    _creationTime: conversation._creationTime,
                    status: conversation.status,
                    organizationId : conversation.organizationId,
                    threadId: conversation.threadId,
                    lastMessage
                }
            })
        );
        return{
            ...conversations,
            page: conversationsWithLastMessage
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

        if(!session || session.expiresAt < Date.now()){
            throw new ConvexError({
                code: "UNAUTORIZED",
                message: "Invalid Session."
            })
        }
        const {threadId}  = await supportAgent.createThread(ctx, {
            userId: args.organizationId
        })
        await saveMessage(ctx,components.agent, {
            threadId,
            message:{
                role: "assistant",

                //todo : modify to widget initial
                content: "Hello, how can i help you today?"
            }
        })
        const conversationId = await ctx.db.insert("conversations",{
            organizationId: args.organizationId,
            contactSessionId: session._id,
            status: "unresolved",
            threadId
        })
        return conversationId
    }
})