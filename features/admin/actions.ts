"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: number, status: OrderStatus) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Akses Ditolak: Hanya Admin yang dapat mengubah status" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/dashboard/admin/orders");
    revalidatePath("/dashboard/user/orders");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: error.message || "Terjadi kesalahan saat memperbarui status" };
  }
}
