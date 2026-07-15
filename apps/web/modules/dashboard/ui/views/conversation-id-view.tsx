"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { api } from "@workspace/backend/_generated/api"
import { Id } from "@workspace/backend/_generated/dataModel"
import { Button } from "@workspace/ui/components/button"
import { useAction, useMutation, useQuery } from "convex/react"
import { MoreHorizontalIcon, Wand2Icon } from "lucide-react"
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

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
})

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">
}) => {
  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  })

  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: 10 }
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  const createMessage = useMutation(api.private.messages.create)
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

  return (
    <div className="flex h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size={"sm"} variant={"ghost"}>
          <MoreHorizontalIcon />
        </Button>
      </header>
      <AIConversation className="flex-1 min-h-0">
        <AIConversationContent>
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
              disabled={conversation?.status === "resolved"}
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
                <AIInputButton>
                  <Wand2Icon/>
                  Enhance
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
