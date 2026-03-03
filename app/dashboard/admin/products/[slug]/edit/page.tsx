import { ProductForm } from "@/features/admin/products/components/ProductForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Edit Produk | Admin Dashboard",
};

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
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

  const product = await prisma.product.findUnique({
    where: { id: Number(params.id) },
  });

  if (!product) {
    redirect("/dashboard/admin/products");
  }

  const serializedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          Edit Produk: {product.name}
        </h2>
      </div>
      <div className="mt-8 border rounded-xl p-6 bg-white dark:bg-zinc-950">
        <ProductForm initialData={serializedProduct} />
      </div>
    </div>
  );
}
