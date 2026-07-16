import { Doc } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from "@workspace/ui/components/dropdown-menu"

export const ConversationStatusButton = ({status, onClick} : {
    status : Doc<"conversations">["status"] | undefined,
    onClick: (value : Doc<"conversations">["status"] )=> void
}) => {
    return ( 
        <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"ghost"}>
                      {status && (
                        <ConversationStatusIcon status={status} />
                        
                      )}
                      <p>{status && status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={()=> onClick("unresolved")}>
                      <ConversationStatusIcon status="unresolved" />
                      Unresolved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> onClick("escalated")}>
                      <ConversationStatusIcon status="escalated" />
                      Escalated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> onClick("resolved")}>
                      <ConversationStatusIcon status="resolved" />
                      Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
     );
}
 
