"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { api } from "@workspace/backend/_generated/api"
import { Doc, Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useAction, useMutation, useQuery } from "convex/react"
import { LoaderCircle, MoreHorizontalIcon, Wand2Icon } from "lucide-react"
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react"
import { Field } from "@workspace/ui/components/field"
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation"

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input"
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message"
import { AIResponse } from "@workspace/ui/components/ai/response"
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar"
import { ConversationStatusButton } from "../components/conversation-status-button"
import {useInfiniteScroll} from "@workspace/ui/hooks/use-infinite-scroll"
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">
}) => {
  const[isEnhancing,setIsEnhancing] = useState(false);
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  })
  const enhanceMesssage = useAction(api.private.messages.enhanceResponse);

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  )

  const {topElementRef,handleLoadMore,canLoadMore,isLoadingMore} = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize:10,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const createMessage = useMutation(api.private.messages.create)
  const updateStatus = useMutation(api.private.conversations.updateStatus)
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation) {
      return
    }
    form.reset()
    await createMessage({
      conversationId: conversation._id,
      prompt: values.message
    })
  }


  if(conversation === undefined || messages.status === "LoadingFirstPage"){
    return <ConversationIdViewLogin/>
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
        <ConversationStatusButton
          status={conversation?.status}
          onClick={(value: Doc<"conversations">["status"]) => {
            if (!conversation) {
              return
            }
            updateStatus({
              conversationId: conversation._id,
              status: value,
            })
          }}
        />
      </header>
      <AIConversation className="flex-1 min-h-0">
        <AIConversationContent>
          <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore= {handleLoadMore}
          ref = {topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => (
            <AIMessage
              from={message.role === "user" ? "assistant" : "user"}
              key={message.id}
            >
              <AIMessageContent>
                <AIResponse>
                  {message.text}
                </AIResponse>
              </AIMessageContent>
              {message.role === "user" && 
                <DicebearAvatar
                seed={conversation?.contactSessionId as string || "user"}
                size={32}
                >

                </DicebearAvatar>
              }
            </AIMessage>
          ))}
        </AIConversationContent>
        <AIConversationScrollButton/>
      </AIConversation>
      <div className="p-2 ">
        <Field data-invalid={!!form.formState.errors.message}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <AIInputTextarea
              disabled={conversation?.status === "resolved" || isEnhancing}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  form.handleSubmit(onSubmit)()
                }
              }}
              placeholder={
                conversation?.status === "resolved"
                  ? "This conversation has been resolved"
                  : "Type your response as an operator..."
              }
              {...form.register("message")}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton 
                disabled = {isEnhancing}
                onClick={async()=>{
                  try {
                    setIsEnhancing(true);
                    const newMsg = await enhanceMesssage({
                      prompt: form.getValues("message")
                    });
                     form.setValue("message", newMsg);
                  } catch (error) {
                    
                  }
                  finally{
                    setIsEnhancing(false);
                  }
                }}>
                  <Wand2Icon/>
                  {isEnhancing? <p className="flex gap-2">Enhancing
                    <LoaderCircle className="animate-spin"/>
                  </p> : <p>Enhance</p>}
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={
                  conversation?.status === "resolved" ||
                  !form.formState.isValid
                }
                type="submit"
                status={form.formState.isSubmitting ? "submitted" : "ready"}
              />
            </AIInputToolbar>
          </AIInput>
        </Field>
      </div>
    </div>
  )
}


export const ConversationIdViewLogin = ()=>{
  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="flex-1 min-h-0">
        <AIConversationContent>
          {Array.from({ length: 8 }).map((_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-72"];
            const width = widths[index % widths.length];

            return (
              <div
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2 [&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
                key={index}
              >
                <Skeleton className={`h-9 ${width} rounded-lg bg-neutral-200`} />
                <Skeleton className="size-8 rounded-full bg-neutral-200" />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator..."
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit disabled status="ready" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  )
}