"use client"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip.js"

interface HintProps {
  chilren: React.ReactNode
  text: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export const Hint = ({
  chilren,
  text,
  side = "top",
  align = "center",
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{chilren}</TooltipTrigger>
        <TooltipContent>
            <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
