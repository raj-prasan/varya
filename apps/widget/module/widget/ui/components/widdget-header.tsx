import { cn } from "@workspace/ui/lib/utils";

const WidgetHeader = ({children, className}: {
    children : React.ReactNode,
    className?: string
    }) => {
    return ( 
        <header className={cn("bg-primary/80 text-sidebar-primary-foreground p-6", className)}>
            {children}
        </header>
     );
}
 
export default WidgetHeader;