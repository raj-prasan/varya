"use client"
import { useAtomValue, useSetAtom } from "jotai"
import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react"
import WidgetHeader from "../components/widdget-header"
import WidgetFooter from "../components/widget-footer"
import { Button } from "@workspace/ui/components/button"
import { screenAtom } from "../../atoms/widget-atoms"

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  
  return (
    <>
      <WidgetHeader>
        <div className="flex items-center gap-x-2">
          <Button
            variant={"transparent"}
            size={"icon"}
            onClick={() => setScreen("selection")}
          >
            <ArrowLeftIcon />
          </Button>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-y-4 p-4">
        <p>INBOX</p>
      </div>
      <WidgetFooter />
    </>
  )
}
