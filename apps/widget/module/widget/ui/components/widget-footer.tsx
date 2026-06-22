import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { HomeIcon, InboxIcon } from "lucide-react";

const WidgetFooter = () => {
    const screen = "selection" as string; 
    return ( 
        <footer className="flex justify-between border-t bg-background items-center">
            <Button className="h-14 flex-1 rounded-none"
            onClick={()=> {}}
            size={"icon"}
            variant={"ghost"}
            >
                <HomeIcon className={cn("size-5" ,screen ==="selection" && "text-destructive  ")}/>
            </Button>

            <Button className="h-14 flex-1 rounded-none"
            onClick={()=> {}}
            size={"icon"}
            variant={"ghost"}
            >
                <InboxIcon className={cn("size-5" ,screen ==="inbox" && "text-primary")}/>
            </Button>
        </footer>
     );
}
 
export default WidgetFooter;