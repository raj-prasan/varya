import { cn } from "@workspace/ui/lib/utils";

const WidgetHeader = ({children, className}: {
    children : React.ReactNode,
    className?: string
    }) => {
    return ( 
        <header className={cn("bg-linear-to-b from-foreground to-primary text-sidebar-primary-foreground", className)}>
            {children}
        </header>
     );
}
 
export default WidgetHeader;