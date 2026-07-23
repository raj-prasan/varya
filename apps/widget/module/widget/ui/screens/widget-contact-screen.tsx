"use client"
import { ArrowLeftIcon, PhoneIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { useAtomValue, useSetAtom } from "jotai"
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms"
import WidgetHeader from "../components/widget-header"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

export const WidgetContactScreen = () => {
  const setScreen = useSetAtom(screenAtom)
  const widgetSettings = useAtomValue(widgetSettingsAtom)

  const phoneNumber = widgetSettings?.vapiSettings?.phoneNumber

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!phoneNumber) return
    try {
      await navigator.clipboard.writeText(phoneNumber)
      setCopied(true)
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCall = () => {
    if (!phoneNumber) return
    window.open(`tel:${phoneNumber}`, "_self")
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-background select-none">
      <WidgetHeader className="flex items-center justify-between border-b border-border/40 bg-transparent p-4 text-foreground">
        <Button
          variant="transparent"
          size="icon"
          onClick={() => setScreen("selection")}
          className="h-9 w-9 rounded-full hover:bg-accent/40"
        >
          <ArrowLeftIcon className="size-4 text-muted-foreground" />
        </Button>
        <span className="text-sm font-semibold tracking-wide text-foreground/80">
          Contact
        </span>
        <div className="h-9 w-9" />
      </WidgetHeader>

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:justify-center">
        {phoneNumber ? (
          <div className="flex flex-col gap-y-4">
            {/* Phone number — just the number, clean */}
            <div className="rounded-lg border border-border/60 px-4 py-4">
              <p className="text-xs text-muted-foreground mb-1">Phone</p>
              <p className="text-lg font-semibold text-foreground tabular-nums">
                {phoneNumber}
              </p>
            </div>

            {/* Actions — same style as selection screen buttons */}
            <Button
              className="h-14 w-full justify-between"
              variant="outline"
              onClick={handleCall}
            >
              <div className="flex items-center gap-x-2">
                <PhoneIcon className="size-4" />
                <span>Call now</span>
              </div>
            </Button>

            <Button
              className={cn(
                "h-14 w-full justify-between",
                copied && "border-emerald-500/50 text-emerald-600"
              )}
              variant="outline"
              onClick={handleCopy}
            >
              <div className="flex items-center gap-x-2">
                {copied ? (
                  <>
                    <CheckIcon className="size-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-4" />
                    <span>Copy number</span>
                  </>
                )}
              </div>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            No phone number configured.
          </p>
        )}
      </div>
    </div>
  )
}


