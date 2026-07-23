import { ArrowLeftIcon, MicIcon, PhoneOff } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useSetAtom } from "jotai"
import { screenAtom } from "../../atoms/widget-atoms"
import { useVapi } from "../../hooks/use-vapi"
import WidgetHeader from "../components/widget-header"
import { cn } from "@workspace/ui/lib/utils"

export const VoiceChatScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const {
    isSpeaking,
    isConnecting,
    isConnected,
    transcript,
    startCall,
    endCall,
  } = useVapi()

  const lastMessage = transcript.length > 0 ? transcript[transcript.length - 1] : null

  return (
    <div className="flex flex-col flex-1 h-full bg-background select-none">
  
      <WidgetHeader className="bg-transparent text-foreground border-b border-border/40 p-4 flex items-center justify-between">
        <Button
          variant="transparent"
          size="icon"
          onClick={() => {
            if (isConnected || isConnecting) {
              endCall()
            }
            setScreen("selection")
          }}
          className="hover:bg-accent/40 rounded-full h-9 w-9"
        >
          <ArrowLeftIcon className="size-4 text-muted-foreground" />
        </Button>
        <span className="font-semibold text-sm tracking-wide text-foreground/80">Voice Session</span>
        <div className="w-9 h-9 flex items-center justify-center">
          {isConnected && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>
      </WidgetHeader>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col items-center justify-between py-10 px-6">
        
        {/* Status text at top */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {isConnecting ? "Connecting" : isConnected ? "Active Session" : "Voice assistant"}
          </p>
        </div>

        {/* Minimal Concentric Outline Visualizer */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Outer Pulsing Waves */}
          {isConnected && (
            <>
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping duration-[3000ms] opacity-50" />
              <div className="absolute inset-4 rounded-full border border-primary/10 animate-ping duration-[3000ms] delay-1000 opacity-40" />
            </>
          )}
          {isConnecting && (
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-spin duration-[10000ms]" />
          )}

          {/* Core Circle */}
          <div
            className={cn(
              "w-24 h-24 rounded-full border flex items-center justify-center transition-all duration-500 shadow-sm",
              isConnected
                ? isSpeaking
                  ? "border-primary/50 bg-primary/5 scale-105"
                  : "border-primary/30 bg-accent/20 scale-100"
                : isConnecting
                  ? "border-primary/40 bg-accent/10 animate-pulse"
                  : "border-border/60 bg-transparent opacity-40 scale-95"
            )}
          >
            <MicIcon
              className={cn(
                "size-8 transition-colors duration-500",
                isConnected ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
        </div>

        {/* Floating Captions Area */}
        <div className="w-full max-w-[290px] flex-1 flex flex-col items-center justify-center text-center px-2">
          {lastMessage ? (
            <div key={transcript.length} className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-2">
              <span className="text-[10px] tracking-widest text-muted-foreground/60 uppercase font-bold">
                {lastMessage.role === "user" ? "You" : "Varya"}
              </span>
              <p
                className={cn(
                  "text-base leading-relaxed tracking-wide font-light",
                  lastMessage.role === "user"
                    ? "text-primary/90 font-medium italic"
                    : "text-foreground font-normal"
                )}
              >
                "{lastMessage.text}"
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60 tracking-wide leading-relaxed max-w-[210px] mx-auto">
              {isConnecting
                ? "Connecting to Varya's voice channel..."
                : isConnected
                  ? "Varya is listening. Speak clearly to start talking."
                  : "Have a real-time, hands-free conversation with Varya."}
            </p>
          )}
        </div>

        {/* Conditional Status Pill Badge */}
        <div className="h-10 flex items-center justify-center mb-4">
          {isConnected && (
            <div className="flex items-center gap-x-2 bg-accent/30 border border-border/50 px-3.5 py-1.5 rounded-full shadow-inner animate-in fade-in duration-300">
              <span
                className={cn(
                  "size-2 rounded-full transition-all duration-500",
                  isSpeaking ? "bg-primary animate-pulse" : "bg-emerald-500 animate-pulse"
                )}
              />
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-bold">
                {isSpeaking ? "Assistant speaking" : "Listening"}
              </span>
            </div>
          )}
        </div>

        {/* Sleek Controls */}
        <div className="flex justify-center items-center">
          {isConnected || isConnecting ? (
            <Button
              onClick={endCall}
              variant="destructive"
              className="rounded-full px-8 py-5.5 h-auto font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] bg-destructive text-destructive-foreground"
            >
              <PhoneOff className="size-4 mr-2" />
              End Session
            </Button>
          ) : (
            <Button
              onClick={()=> startCall()}
              className="rounded-full px-8 py-5.5 h-auto bg-primary text-primary-foreground font-semibold shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] tracking-wide"
            >
              <MicIcon className="size-4 mr-2" />
              Start Call
            </Button>
          )}
        </div>

      </div>

    </div>
  )
}

