import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/sidebar-02/app-sidebar";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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
      <div className="w-full flex-1 overflow-hidden">{children}</div>
    </SidebarProvider>
  );
}
