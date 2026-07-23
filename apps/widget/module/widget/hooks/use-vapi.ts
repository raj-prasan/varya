import Vapi from "@vapi-ai/web";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { vapiSecretsAtom, widgetSettingsAtom } from "../atoms/widget-atoms";

interface TranscriptMessage {
    role: "user"| "assistant";
    text: string
};

export const useVapi = ()=>{
    const vapiSecrets = useAtomValue(vapiSecretsAtom);
    const widgetSettings = useAtomValue(widgetSettingsAtom)
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const[isConnected, setIsConnected] = useState(false);
    const[isConnecting, setIsconnecting] = useState(false);
    const[isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([])

    useEffect(()=>{
        if(!vapiSecrets){
            return;
        }
        const vapiInstance = new Vapi(vapiSecrets.publicApiKey);
        setVapi(vapiInstance);

        vapiInstance.on("call-start",()=>{
            setIsConnected(true);
            setIsconnecting(false);
            setTranscript([]);

        })
        vapiInstance.on("call-end",()=>{
            setIsConnected(false);
            setIsconnecting(false);
            setTranscript([]);

        })

        vapiInstance.on("speech-start",()=>{
            setIsSpeaking(true);
        });
        vapiInstance.on("speech-end",()=>{
            setIsSpeaking(false);
        });

        vapiInstance.on("error",(error)=>{
            console.log(error,"VAPI ERROR");
            setIsSpeaking(false);
        });

        vapiInstance.on("message", (message)=>{
            if(message.type === "transcript" && message.transcriptType === "final"){
                setTranscript((prev)=> [...prev, {
                    role: message.role === "user"? "user": "assistant",
                    text: message.transcript,

                }])
            }
        })

        return ()=>{
            vapiInstance.stop()
        }
    },[])

    const startCall = ()=>{
        if(!vapiSecrets || !widgetSettings?.vapiSettings.assistantId){
            return;
        }
        setIsconnecting(true);
        if(vapi){
            
            vapi.start(widgetSettings.vapiSettings.assistantId);
        }
    }
    const endCall = ()=>{
        if(vapi){
            vapi.stop()
        }
    }
    return {
        isSpeaking,
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall
    }
} 