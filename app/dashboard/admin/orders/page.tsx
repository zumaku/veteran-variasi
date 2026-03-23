import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata = {
  title: "Kelola Pesanan | Veteran Variasi (Admin)",
};

export default async function AdminOrdersPage() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId as number } });
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      car: true,
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">Manajemen Pesanan</h1>
        <p className="text-muted-foreground">Atur jadwal pengerjaan dan pantau status tagihan pelanggan.</p>
      </div>
      <AdminOrdersClient initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
