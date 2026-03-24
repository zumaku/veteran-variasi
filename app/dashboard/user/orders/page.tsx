import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Riwayat Pesanan | Veteran Variasi",
};

export default async function OrdersPage() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    include: {
      car: true,
      review: true,
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
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">Riwayat Pesanan</h1>
        <p className="text-muted-foreground">Pantau dan kelola semua transaksi Anda di sini.</p>
      </div>
      <OrdersClient initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
