import { ContactPanel } from "@/modules/dashboard/ui/components/contact-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"

export const ConversationIdLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ResizablePanelGroup className="h-full flex-1 " orientation="horizontal">
      <ResizablePanel className="h-full" defaultSize={60}>
        <div className="flexx flex-col h-full flex-1">
          {children}
        </div>
      </ResizablePanel>
      <ResizableHandle className="hidden lg:block"/>
      <ResizablePanel
      className="hidden lg:block"
      defaultSize={40}
      maxSize={400}
      minSize={300}
      >
        <ContactPanel/>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
