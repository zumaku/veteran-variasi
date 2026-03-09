import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Package,
  Hash,
  Text,
  Tag,
  Coins,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });
  return {
    title: product
      ? `Detail ${product.name} | Admin Dashboard`
      : "Product Not Found",
  };
}

export default async function ProductDetailsPage({
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

  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { images: true, categories: true },
  });

  if (!product) {
    redirect("/dashboard/admin/products");
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="grid">
            <h2 className="text-3xl font-bold tracking-tight">Detail Produk</h2>
            <p className="text-muted-foreground w-full">
              Melihat informasi lengkap produk.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/admin/products/${product.slug}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Produk
          </Link>
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <div className="border rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
          <h3 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Informasi Produk
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                  <Text className="h-4 w-4" /> Nama Produk
                </p>
                <p className="text-lg font-medium">{product.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                    <Tag className="h-4 w-4" /> Tipe
                  </p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {product.type === "ACCESSORY" ? "Aksesoris" : "Layanan"}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4" /> Kategori
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                        >
                          {cat.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground italic">
                        Belum ada kategori
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                  <Coins className="h-4 w-4" /> Harga
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0,
                  }).format(Number(product.price))}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                  <Layers className="h-4 w-4" /> Stok Tersedia
                </p>
                <p className="text-lg font-medium">
                  {product.stock !== null
                    ? product.stock
                    : "Tidak Terbatas (N/A)"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
              <Text className="h-4 w-4" /> Deskripsi Produk
            </p>

            <div className="bg-muted/30 rounded-lg whitespace-pre-wrap">
              {product.description || (
                <span className="text-muted-foreground italic">
                  Tidak ada deskripsi yang ditambahkan untuk produk ini.
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-white dark:bg-zinc-950 shadow-sm space-y-6">
          <h3 className="text-xl font-semibold border-b pb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" /> Foto Produk
          </h3>

          {product.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-lg overflow-hidden border"
                >
                  <Image
                    src={img.url}
                    alt={`${product.name} image`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center justify-center min-h-[150px]">
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-muted-foreground italic text-sm">
                Tidak ada foto yang ditambahkan untuk produk ini.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
