import { ConversationsPanel } from "@/modules/dashboard/ui/components/conversations-panel"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable"

export const ConversationsLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ResizablePanelGroup
      className="h-full min-h-0 min-w-0 flex-1"
      orientation="horizontal"
    >
      <ResizablePanel defaultSize={32} minSize={250} maxSize={400}>
        <ConversationsPanel/>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="h-full min-w-0" defaultSize={600}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
