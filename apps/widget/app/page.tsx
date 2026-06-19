"use client"

import { Button } from "@workspace/ui/components/button"
import { useVapi } from "@/module/widget/hooks/use-vapi"
export default function Page() {
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi()
  return (
    <div className="flex items-center justify-center min-h-svh flex-col p-6 max-w-md mx-auto w-full">
      <div>apps/widget</div>
      <Button onClick={()=> startCall()}>Start Call</Button>
      <Button variant={"destructive"} onClick={()=> endCall()}>End Call</Button>
      <p>isConnected : {String(isConnected)}</p>
      <p>isConnecting : {String(isConnecting)}</p>
      <p>isSpeaking : {String(isSpeaking)}</p>
      <p>{JSON.stringify(transcript, null, 2)}</p>

    </div>
  )
}
