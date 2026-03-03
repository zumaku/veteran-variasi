import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, Settings, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

/**
 * Dashboard landing page.
 * Validates the user's session and displays a personalized welcome if authenticated.
 * @returns Dashboard JSX
 */
export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Fetch full user data assuming session has userId
  const user = await prisma.user.findUnique({
    where: { id: (session as any).userId },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Selamat Datang, {user.name.split(" ")[0]}! 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          Ini adalah dashboard akun Anda. Anda dapat mengelola profil dan
          pesanan di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Profil Saya</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Lihat dan ubah informasi pribadi Anda termasuk nomor telepon dan
            email.
          </p>
          <Button variant="outline" className="w-full">
            Kelola Profil
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border rounded-xl p-6 shadow-sm">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Pengaturan</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Atur preferensi akun, notifikasi, dan keamanan password Anda.
          </p>
          <Button variant="outline" className="w-full">
            Buka Pengaturan
          </Button>
        </div>
      </div>
    </main>
  );
}
