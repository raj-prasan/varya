"use client"

import { screenAtom } from "../../atoms/widget-atoms"
import { WidgetErrorScreen } from "../screens/error-screen"
/* import WidgetHeader from "../components/widdget-header"
import WidgetFooter from "../components/widget-footer" */
import WidgetAuthScreen from "../screens/widget-auth-screen"
import { useAtomValue } from "jotai"
import { WidgetLoadingScreen } from "../screens/widget-loading-screen"
import { WidgetSelectionScreen } from "../screens/widget-selection-screen"
import { WidgetChatScreen } from "../screens/widget-chat-screen"
import { WidgetInboxScreen } from "../screens/widget-inbox-screen"

interface Props{
    organizationId: string | null
}

export const WidgetView = ({organizationId}: Props)=>{

    const screen = useAtomValue(screenAtom)

    const screenComponents = {
        error: <WidgetErrorScreen/>,
        loading: <WidgetLoadingScreen organizationId={organizationId}/>,
        auth: <WidgetAuthScreen/>,
        voice: <p>voice</p>,
        inbox: <WidgetInboxScreen/>,
        selection: <WidgetSelectionScreen/>,
        chat: <WidgetChatScreen/>,
        contact : <p>Contact</p>

    }
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-0 border bg-muted">
            {screenComponents[screen]}
           {/*  <WidgetFooter/> */}
        </main>
    )
}