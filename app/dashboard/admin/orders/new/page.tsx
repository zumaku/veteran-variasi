import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ManualOrderForm } from "./ManualOrderForm";

export const metadata = {
  title: "Tambah Pesanan Manual | Veteran Variasi (Admin)",
};

export default async function NewManualOrderPage() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId as number } });
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const rawProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { images: true },
  });

  const products = rawProducts.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">Tambah Pesanan Manual</h1>
        <p className="text-muted-foreground">Buat pesanan untuk pelanggan yang datang langsung (walk-in) ke bengkel.</p>
      </div>
      <ManualOrderForm products={products} />
    </div>
  );
}
