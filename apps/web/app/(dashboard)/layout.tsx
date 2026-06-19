import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import { DashboardLayout } from "@/modules/ui/layouts/dashboard-layout";

const Layout = ({children}: {children: React.ReactNode}) => {
    return ( 
        <DashboardLayout>
            {children}
        </DashboardLayout>
     );
}
 
export default Layout;