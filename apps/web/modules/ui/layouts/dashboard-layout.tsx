import { AuthGuard } from "@/modules/auth/ui/components/auth-guard"
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar"
import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { cookies } from "next/headers"

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar />
        <main className="flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden">
          {children}
        </main>
      </SidebarProvider>
    </AuthGuard>
  )
}
