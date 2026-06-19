"use client"

import WidgetHeader from "../components/widdget-header"
import WidgetFooter from "../components/widget-footer"

interface Props{
    organizationId: string
}

export const WidgetView = ({organizationId}: Props)=>{
    return (
        <main className="min-h-screen min-w-sceen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-2 px-2 py-6">
                    <p className="font-semi-bold text-3xl">
                        Hi there! 👋
                    </p>
                    <p className="font-semi-bold text-lg">
                        How can we help you today?
                    </p>
                    
                </div>
            </WidgetHeader>
            <div className="flex flex-1">
                Widget View: {organizationId}
            </div>
            <WidgetFooter/>
        </main>
    )
}