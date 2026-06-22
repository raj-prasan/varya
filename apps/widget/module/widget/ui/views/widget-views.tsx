"use client"

/* import WidgetHeader from "../components/widdget-header"
import WidgetFooter from "../components/widget-footer" */
import WidgetAuthScreen from "../screens/widget-screen"

interface Props{
    organizationId: string
}

export const WidgetView = ({organizationId}: Props)=>{
    return (
        <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-0 border bg-muted">
            <WidgetAuthScreen/>
           {/*  <WidgetFooter/> */}
        </main>
    )
}