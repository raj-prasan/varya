import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
    role: "user"| "assistant";
    text: string
};

export const useVapi = ()=>{
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const[isConnected, setIsConnected] = useState(false);
    const[isConnecting, setIsconnecting] = useState(false);
    const[isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptMessage[]>([])

    useEffect(()=>{
        //Only for testing the Vapi API , otherwise the customer will provide their own api keys
        const vapiInstance = new Vapi(process.env.VAPI_API_KEY as string);
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
        setIsconnecting(true);
        if(vapi){
            //Only for testing the Vapi API , otherwise the customer will provide their own Assistant ID
            vapi.start("763119ac-4877-4bd1-97ef-2188ed123026");
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