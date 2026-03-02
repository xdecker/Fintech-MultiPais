import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard";
import { AuthGuard } from "@/guards/auth.guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-blue-50">
            <div className="@container/main flex flex-1 flex-col gap-2 m-2">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
