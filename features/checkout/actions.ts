'use server';

import { getSession } from '@/lib/session';
import { startOfDay, endOfDay } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function submitCheckoutAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  const itemId = formData.get('itemId') as string;
  const bookingDate = formData.get('bookingDate') as string;
  const timeSlot = formData.get('timeSlot') as string;
  const paymentMethod = formData.get('paymentMethod') as string;
  const carId = formData.get('carId') as string;

  if (!itemId || !bookingDate || !timeSlot || !paymentMethod || !carId) {
    return { success: false, error: 'Harap lengkapi semua field yang diperlukan' };
  }

  let orderId;

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: { product: true }
    });

    if (!cartItem) {
      return { success: false, error: 'Item keranjang tidak ditemukan' };
    }

    const orderNumber = `ORD-${Date.now()}`;
    const totalAmount = cartItem.quantity * Number(cartItem.product.price);
    
    // Set expiry 15 mins from now
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000);
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.userId as number,
        carId: parseInt(carId),
        bookingDate: new Date(bookingDate),
        timeSlot: parseInt(timeSlot),
        totalAmount,
        paymentToken: paymentMethod, // We save it here instead to avoid out-of-sync Prisma schemas
        status: 'PENDING',
        expiredAt,
        items: {
          create: {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            priceAtBooking: cartItem.product.price
          }
        }
      } as any
    });

    // Delete from cart since it has been converted to an order
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    orderId = order.id;

  } catch (err) {
    console.error(err);
    return { success: false, error: 'Terjadi kesalahan saat membuat pesanan' };
  }

  return { success: true, orderId };
}

export async function checkAvailability(dateStr: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        bookingDate: new Date(dateStr),
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        timeSlot: true
      }
    });

    // Return array of booked timeSlot numbers
    return orders.map(o => o.timeSlot).filter((val): val is number => val !== null);
  } catch (err) {
    console.error("Error checking availability:", err);
    return [];
  }
}

export async function checkSlotAvailabilityAction(
  dateString: string
): Promise<{ timeSlot: number; taken: number; isFull: boolean }[]> {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error("Unauthorized");
    }

    const startOfDayNode = startOfDay(new Date(dateString));
    const endOfDayNode = endOfDay(new Date(dateString));

    const ordersOnDate = await prisma.order.findMany({
      where: {
        bookingDate: {
          gte: startOfDayNode,
          lte: endOfDayNode,
        },
        status: {
          in: ["PENDING", "PAID"],
        },
      },
      select: {
        timeSlot: true,
      },
    });

    const slots = [1, 2, 3];
    return slots.map((slotNum) => {
      const takenCount = ordersOnDate.filter(
        (o) => o.timeSlot === slotNum
      ).length;
      return {
        timeSlot: slotNum,
        taken: takenCount,
        isFull: takenCount >= 3,
      };
    });
  } catch (error: any) {
    console.error("Failed to check slot availability:", error);
    return [];
  }
}

export async function simulatePaymentAction(orderId: number) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan" };
    }
    
    if (order.userId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (order.status !== "PENDING") {
      return { success: false, error: "Pesanan sudah diproses" };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to simulate payment:", error);
    return { success: false, error: error.message || "Gagal menyimulasikan pembayaran" };
  }
}

export async function getMonthlyAvailability(year: number, month: number) {
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const orders = await prisma.order.findMany({
      where: {
        bookingDate: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        bookingDate: true,
      }
    });

    const availability: Record<string, number> = {};
    orders.forEach(order => {
      if (!order.bookingDate) return;
      const dateStr = order.bookingDate.toISOString().split('T')[0];
      availability[dateStr] = (availability[dateStr] || 0) + 1;
    });

    return availability; 
  } catch (err) {
    console.error("Error getting monthly availability:", err);
    return {};
  }
}

export async function cancelOrderAction(orderId: number) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== session.userId) {
      return { success: false, error: 'Order not found' };
    }
    if (order.status !== 'PENDING') {
      return { success: false, error: 'Pesanan tidak bisa dibatalkan' };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });
    return { success: true };
  } catch (err) {
    console.error("Error cancelling order:", err);
    return { success: false, error: 'Gagal membatalkan pesanan' };
  }
}
