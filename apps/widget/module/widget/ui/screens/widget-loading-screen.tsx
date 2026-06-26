"use client"
import { useAtomValue, useSetAtom } from "jotai"
import { LoaderIcon } from "lucide-react"
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms"
import WidgetHeader from "../components/widdget-header"
import { useEffect, useState } from "react"
import { useAction, useMutation } from "convex/react"
import { api } from "@workspace/backend/_generated/api"
import { Id } from "@workspace/backend/_generated/dataModel"

type InitStep  =  "org"| "session" | "settings" | "vapi" | "done"

export const WidgetLoadingScreen = ({organizationId}: {organizationId: string| null})=>{
    const [step, setStep] = useState<InitStep>("org");
    const [sessionValid, setSessionValid] = useState(false);
    const setScreen = useSetAtom(screenAtom)
    const setLoadingMessage = useSetAtom(loadingMessageAtom)
    const loadingMessage = useAtomValue(loadingMessageAtom)
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setOrganization = useSetAtom(organizationIdAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

    //Step 1 - Validate Organization
    const validateOrganization = useAction(api.public.organizations.validate)
    useEffect(()=>{
        if(step != "org"){
            return;
        }
        setLoadingMessage("Finding Organization ID...");

        if(!organizationId){
            setErrorMessage("Organization required.");
            setScreen("error");
            return;
        }
        
        setLoadingMessage("Validating Organization...");

        validateOrganization({organizationId})
        .then((result)=> {
            if(result.valid){
                setOrganization(organizationId);
                setStep("session")
            }
            else{
                setErrorMessage(result.reason || "invalid configuration");
                setScreen("error");
            }
        }).catch((error)=>{
            setErrorMessage('Unable to verify organization');;
            setScreen(error)
        })
    


    },[step,organizationId, setErrorMessage, setScreen, setOrganization, setStep, validateOrganization ,setLoadingMessage]);

    const validateContactSession = useMutation(api.public.contactSession.validate)

    useEffect(()=>{
        if(step !== "session"){
            return;
        };

        setLoadingMessage("Finding Contact Session ID...");

        if(!contactSessionId){
            setSessionValid(false);
            setStep("done");
            return;
        }

        setLoadingMessage("Validating Contact Session...");

        validateContactSession({
            contactSessionId: contactSessionId
        }).then((result)=>{
            setSessionValid(result.valid);
            setStep("done")
            setScreen("selection")
        }).catch((error)=>{
            setSessionValid(false);
            setStep("done")
        })


    }, [step,contactSessionId,validateContactSession,setLoadingMessage, setStep, setSessionValid])

    useEffect(()=>{
        if(step != "done"){
            return;
        }
        const hasValidSession = contactSessionId && sessionValid;
        setScreen(hasValidSession? "selection" : "auth")
    }, [step,contactSessionId,setScreen, setScreen])
    
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
            <div className="flex flex-col flex-1 items-center justify-center p-4 gap-y-4 test-muted-foreground">
                <LoaderIcon className="animate-spin"/>
                <p className="text-sm">
                    {loadingMessage || "Loading..."}
                </p>
            </div>
        </>
    )
}