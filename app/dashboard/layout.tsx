import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/sidebar-02/app-sidebar";



export const metadata: Metadata = {
  title: "Veteran Variasi",
  description: "Rawat Mobil Anda Tanpa Antri Lama",
};
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let user = null;

  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { name: true, role: true },
    });
  }

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <div className="w-full h-screen flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background z-10 shrink-0">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-primary" />
            <span className="font-bold font-montserrat text-sm tracking-tight text-foreground">Veteran Variasi</span>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 w-full overflow-y-auto">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
