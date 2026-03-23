import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import AdminOrderDetailClient from "./AdminOrderDetailClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Detail Pesanan | Veteran Variasi (Admin)",
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId as number } });
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
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

  if (!order) notFound();

  return (
    <div className="w-full px-4 lg:px-8 py-8">
      <Link 
        href="/dashboard/admin/orders" 
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Kelola Pesanan
      </Link>
      
      <div className="mb-8">
        <h1 className="text-3xl font-black font-montserrat tracking-tight">Detail Pesanan #{order.orderNumber.substring(order.orderNumber.length - 8)}</h1>
        <p className="text-sm text-muted-foreground mt-1">Tinjau informasi selengkapnya mengenai pembeli dan item produk.</p>
      </div>
      
      <AdminOrderDetailClient order={JSON.parse(JSON.stringify(order))} />
    </div>
  );
}
