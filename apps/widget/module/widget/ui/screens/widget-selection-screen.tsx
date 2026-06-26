"use client"
import { useAtomValue, useSetAtom } from "jotai"
import WidgetHeader from "../components/widdget-header"
import { Button } from "@workspace/ui/components/button"
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react"
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useState } from "react"

export const WidgetSelectionScreen = ()=>{
    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
    const setConversationId = useSetAtom(conversationIdAtom)

    const createConversation = useMutation(api.public.conversations.create);
    const [isPending, setIsPending] = useState(false)

    const handleNewConversation = async ()=>{
        
        if(!contactSessionId){
            setScreen("auth");
            return;

        }
        if(!organizationId){
            setScreen("error");
            return;
        }
        setIsPending(true)
        try {
            const conversationId = await createConversation({
                contactSessionId: contactSessionId as any,
                organizationId
            })
            setConversationId(conversationId)
            setScreen("chat")
        } catch (error) {
            setScreen("auth")
        }
        finally{
            setIsPending(false)
        }
    
    }

    return(
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-2 px-2 py-6">
                    <p className="font-semibold text-3xl">
                        Hi there! 👋
                    </p>
                    <p className="font-semibold text-lg opacity-90">
                        Let's get you started
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-col flex-1 p-4 gap-y-4 overflow-y-auto">
                <Button className="h-16 w-full justify-between"
                variant={"outline"}
                onClick={handleNewConversation}
                disabled = {isPending}>
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4"/>
                        <span>
                            Start Chat
                        </span>
                        <ChevronRightIcon/>
                    </div>
                </Button>
            </div>
        </>
    )
}