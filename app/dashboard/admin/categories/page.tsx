import { prisma } from "@/lib/prisma";
import { CategoryTable } from "@/features/admin/categories/components/CategoryTable";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Kelola Kategori | Admin Dashboard",
};

export default async function AdminCategoriesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session as any).userId },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Kategori</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/dashboard/admin/categories/create">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Link>
          </Button>
        </div>
      </div>
      <CategoryTable categories={categories} />
    </div>
  );
}
