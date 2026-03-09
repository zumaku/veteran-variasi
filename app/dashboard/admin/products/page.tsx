import { prisma } from "@/lib/prisma";
import { ProductTable } from "@/features/admin/products/components/ProductTable";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Kelola Produk | Admin Dashboard",
};

/**
 * Admin Product List Page
 * Displays paginated/searchable table of all products
 */
export default async function AdminProductsPage() {
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

  const products = await prisma.product.findMany({
    orderBy: {
      id: "desc",
    },
    include: {
      images: true,
      categories: true,
    },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Kelola Produk</h2>
      </div>
      <ProductTable products={serializedProducts} />
    </div>
  );
}
