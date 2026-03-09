import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Edit, Package, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/features/admin/products/components/ProductTable";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
  });
  return {
    title: category
      ? `Detail Kategori ${category.name} | Admin Dashboard`
      : "Category Not Found",
  };
}

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
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

  const resolvedParams = await params;

  const category = await prisma.category.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      products: {
        include: {
          images: true,
          categories: true,
        },
      },
    },
  });

  if (!category) {
    redirect("/dashboard/admin/categories");
  }

  const serializedProducts = category.products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="grid">
            <h2 className="text-3xl font-bold tracking-tight">
              Detail Kategori
            </h2>
            <p className="text-muted-foreground w-full">
              Melihat informasi kategori dan produk terkait.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/admin/categories/${category.slug}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Kategori
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        <div className="border rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
          <h3 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Informasi Kategori
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                  <Text className="h-4 w-4" /> Nama Kategori
                </p>
                <p className="text-lg font-medium">{category.name}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                <Text className="h-4 w-4" /> Deskripsi
              </p>
              <div className="bg-muted/30 p-4 rounded-lg min-h-[100px] whitespace-pre-wrap">
                {category.description || (
                  <span className="text-muted-foreground italic">
                    Tidak ada deskripsi.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold tracking-tight mb-6">
          Daftar Produk ({serializedProducts.length})
        </h3>
        <ProductTable products={serializedProducts} />
      </div>
    </div>
  );
}
