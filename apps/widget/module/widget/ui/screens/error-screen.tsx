"use client"
import { useAtomValue } from "jotai"
import { AlertTriangleIcon } from "lucide-react"
import { errorMessageAtom } from "../../atoms/widget-atoms"
import WidgetHeader from "../components/widget-header"

export const WidgetErrorScreen = ()=>{
    const errorMessage = useAtomValue(errorMessageAtom);
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
                <AlertTriangleIcon/>
                <p className="text-sm">
                    {errorMessage || "Invalid Configuration"}
                </p>
            </div>
        </>
    )
}