"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function submitReviewAction(
  orderId: number,
  rating: number,
  comment: string,
) {
  const session = await getSession();
  if (!session?.userId) {
    return { success: false, error: "Tidak terautentikasi." };
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: "Rating harus antara 1 dan 5." };
  }

  // Verify order belongs to user and is COMPLETED
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { review: true },
  });

  if (!order || order.userId !== session.userId) {
    return { success: false, error: "Pesanan tidak ditemukan." };
  }

  if (order.status !== "COMPLETED") {
    return {
      success: false,
      error: "Pesanan belum selesai dikerjakan.",
    };
  }

  if (order.review) {
    return { success: false, error: "Pesanan ini sudah pernah diulas." };
  }

  await prisma.review.create({
    data: {
      orderId,
      rating,
      comment: comment.trim() || null,
    },
  });

  return { success: true };
}
