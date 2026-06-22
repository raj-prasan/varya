"use client"

import { screenAtom } from "../../atoms/widget-atoms"
/* import WidgetHeader from "../components/widdget-header"
import WidgetFooter from "../components/widget-footer" */
import WidgetAuthScreen from "../screens/widget-screen"
import { useAtomValue } from "jotai"

interface Props{
    organizationId: string
}

export const WidgetView = ({organizationId}: Props)=>{

    const screen = useAtomValue(screenAtom)

    const screenComponents = {
        error: <p>Error</p>,
        loading: <p>loading</p>,
        auth: <WidgetAuthScreen/>,
        voice: <p>voice</p>,
        inbox: <p>inbox</p>,
        selection: <p>selection</p>,
        chat: <p>chat</p>,
        contact : <p>Contact</p>

    }
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-0 border bg-muted">
            {screenComponents[screen]}
           {/*  <WidgetFooter/> */}
        </main>
    )
}