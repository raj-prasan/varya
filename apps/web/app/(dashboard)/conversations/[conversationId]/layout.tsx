import { ConversationIdLayout } from "@/modules/ui/layouts/conversation-id-layout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return(
    <ConversationIdLayout>
      {children}
    </ConversationIdLayout>
  )
};

export default Layout
