"use client"
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"

import {
    CreditCardIcon,
    InboxIcon,
    LayoutDashboardIcon,
    LibraryBigIcon,
    Mic, PaletteIcon
} from "lucide-react"

import { 
    Sidebar, 
    SidebarContent, 
    SidebarFooter,
    SidebarGroup, 
    SidebarGroupContent, 
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, 
    SidebarRail
} from "@workspace/ui/components/sidebar"

 import { cn } from "@workspace/ui/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"


const customerSupportItems = [
    {
        title: "Conversations",
        icon: InboxIcon,
        url: "/conversations",
    },
    {
        title: "knowledge Base",
        icon: LibraryBigIcon,
        url: "/files",
    },
]
const configurationItems = [
    {
        title: "Widget Costumization",
        icon: PaletteIcon,
        url: "/customization",
    },
    {
        title: "Integrations",
        icon: LayoutDashboardIcon,
        url: "/integrations",
    },
    {
        title: "Voice Assistants",
        icon: Mic,
        url: "/plugins/vapi",
    },
]
const accountItems = [
    {
        title: "Plans and billing",
        icon: CreditCardIcon,
        url: "/billing",
    },
    
]

export const DashboardSidebar = ()=>{
    const pathName = usePathname();
    const isActive = (url: string) =>{
        if(url === "/"){
            return pathName === ("/")
        }
        return pathName.startsWith(url);
    }
    return (
        <Sidebar className="group" collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg">
                           <OrganizationSwitcher hidePersonal
                           skipInvitationScreen
                           appearance={{
                            elements:{
                                rootBox: "w-full! h-8!",
                                avatarBox: "size-4! rounded-sm!",
                                organizationSwitcherTrigger:"w-full! justify-start!  group-data-[collapsible=icon]:p-2!",
                                organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2",
                                organizationPreviewTextContainer: "group-data-[collapsible=icon]:hidden! text-xs! font-md! text-sidebar-foreground!",
                                organizationSwitcherTriggerIcon: "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground"
                            }
                           }}
                           /> 
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* customer Support */}
                <SidebarGroup>
                    <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
                    <SidebarMenu>
                        {customerSupportItems.map((item)=>(
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                asChild
                                className={cn(
                                    isActive(item.url) && "bg-primary! text-sidebar-primary-foreground!"
                                )}
                                isActive = {isActive(item.url)}
                                >
                                    <Link href={item.url}>
                                    <item.icon className="size-4"/>
                                    <span className="text-md">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                    <SidebarMenu>
                        {configurationItems.map((item)=>(
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                asChild
                                className={cn(
                                    isActive(item.url) && "bg-primary! to-foreground! text-sidebar-primary-foreground!"
                                )}
                                isActive = {isActive(item.url)}
                                >
                                    <Link href={item.url}>
                                    <item.icon className="size-4"/>
                                    <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarMenu>
                        {accountItems.map((item)=>(
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton 
                                asChild
                                className={cn(
                                    isActive(item.url) && "bg-primary! to-foreground! text-sidebar-primary-foreground!"
                                )}
                                isActive = {isActive(item.url)}
                                >
                                    <Link href={item.url}>
                                    <item.icon className="size-4"/>
                                    <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <UserButton showName
                    appearance={{
                        elements:{
                            rootbox: "w-full h-8!",
                            userButtonTrigger: "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                            userButtonBox: "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground! ",
                            userButtonOuterIdentifier: "pl-0! group-data-[collapsible=icon]:hidden!",
                            avatarBox: "size-5!"
                        }
                    }}
                    />
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}


