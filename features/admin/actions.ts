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

    const user = await prisma.user.findUnique({ where: { id: session.userId as number } });
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

export type ManualOrderItemInput = {
  productId: number;
  quantity: number;
  priceAtBooking: number;
};

export async function createManualOrderAction(data: {
  customerName: string;
  customerPhone: string;
  carBrand: string;
  carModel: string;
  items: ManualOrderItemInput[];
  totalAmount: number;
}) {
  try {
    const session = await getSession();
    if (!session || !session.userId) return { success: false, error: "Unauthorized" };
    const adminUser = await prisma.user.findUnique({ where: { id: session.userId as number } });
    if (!adminUser || adminUser.role !== "ADMIN") return { success: false, error: "Hanya Admin yang dapat membuat pesanan manual" };

    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Pesanan harus memiliki minimal 1 produk/layanan" };
    }

    // Wrap everything in a sequential operation, first finding/creating the user and car, then the transaction.
    // Use phone number as the primary identifier for offline users
    const cleanPhone = data.customerPhone.trim();
    let walkInUser = await prisma.user.findFirst({
      where: { phone: cleanPhone }
    });

    if (!walkInUser) {
      const ts = Date.now();
      walkInUser = await prisma.user.create({
        data: {
          name: data.customerName,
          phone: cleanPhone,
          email: `walkin_${ts}@offline.local`,
          username: `walkin_${ts}`,
          password_hash: "OFFLINE_NO_AUTH",
          role: "CUSTOMER",
        }
      });
    } else {
      // Update name if different? Not strictly necessary, but good UX if they just typoed last time
      if (walkInUser.name !== data.customerName) {
         walkInUser = await prisma.user.update({
           where: { id: walkInUser.id },
           data: { name: data.customerName }
         });
      }
    }

    // Now find or create car
    let car = await prisma.car.findFirst({
      where: { 
         userId: walkInUser.id,
         brand: data.carBrand,
         model: data.carModel
      }
    });

    if (!car) {
      const ts = Date.now();
      car = await prisma.car.create({
         data: {
            userId: walkInUser.id,
            brand: data.carBrand,
            model: data.carModel,
            year: new Date().getFullYear(),
            slug: `walkincarslug-${ts}`,
            licensePlate: "N/A"
         }
      });
    }

    const orderNumber = `WALKIN-${Date.now()}`;

    // Use transaction for order and stock manipulation
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: walkInUser.id,
          carId: car.id,
          totalAmount: data.totalAmount,
          status: "PROCESSING",
          paymentMethod: "BAYAR_DI_BENGKEL",
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtBooking: item.priceAtBooking,
            }))
          }
        }
      });

      // Update Stock
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (product && product.stock !== null) {
           await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } }
           });
        }
      }

      return order;
    });

    revalidatePath("/dashboard/admin/orders");
    
    return { success: true, orderId: newOrder.id };
  } catch (error: any) {
    console.error("Failed to create manual order", error);
    return { success: false, error: "Gagal membuat pesanan manual: " + error.message };
  }
}
