import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
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
      <div className="w-full flex-1">{children}</div>
    </SidebarProvider>
  );
}
