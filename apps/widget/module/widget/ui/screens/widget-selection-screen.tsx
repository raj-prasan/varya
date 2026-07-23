"use client"
import { useAtomValue, useSetAtom } from "jotai"
import WidgetHeader from "../components/widget-header"
import { Button } from "@workspace/ui/components/button"
import { ChevronRightIcon, MessageSquareTextIcon, MicIcon, PhoneIcon } from "lucide-react"
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, hasVapiSecretsAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms"
import { useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { useState } from "react"
import WidgetFooter from "../components/widget-footer"

export const WidgetSelectionScreen = ()=>{
    const setScreen = useSetAtom(screenAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const organizationId = useAtomValue(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
    const setConversationId = useSetAtom(conversationIdAtom)
    const widgetSettings = useAtomValue(widgetSettingsAtom)
    const hasVapiSecrets = useAtomValue(hasVapiSecretsAtom)

    const createConversation = useMutation(api.public.conversations.create);
    const [isPending, setIsPending] = useState(false)

    const handleNewConversation = async ()=>{
        
        if(!contactSessionId){
            setScreen("auth");
            return;

        }
        if(!organizationId){
            setErrorMessage("Organization Id is required")
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
        <div className="flex min-h-0 flex-1 flex-col">
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
            <div className="flex min-h-0 flex-1 flex-col gap-y-4 overflow-y-auto p-4 sm:justify-center">
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

                {hasVapiSecrets && widgetSettings?.vapiSettings.assistantId && <Button className="h-16 w-full justify-between"
                variant={"outline"}
                onClick={()=> setScreen("voice")}
                disabled = {isPending}>
                    <div className="flex items-center gap-x-2">
                        <MicIcon className="size-4"/>
                        <span>
                            Start Voice Call
                        </span>
                        <ChevronRightIcon/>
                    </div>
                </Button>}

                {hasVapiSecrets && widgetSettings?.vapiSettings.phoneNumber && <Button className="h-16 w-full justify-between"
                variant={"outline"}
                onClick={()=> setScreen("contact")}
                disabled = {isPending}>
                    <div className="flex items-center gap-x-2">
                        <PhoneIcon className="size-4"/>
                        <span>
                            Call Us
                        </span>
                        <ChevronRightIcon/>
                    </div>
                </Button>}
                
                
            </div>
            <WidgetFooter/>
        </div>
    )
}