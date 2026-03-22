import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import PaymentClient from "./PaymentClient";

export const metadata = {
  title: "Menunggu Pembayaran | Veteran Variasi",
};

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  
  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const orderId = parseInt(id);
  if (isNaN(orderId)) {
    notFound();
  }

  // Fetch the order and verify ownership
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
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

  if (!order || order.userId !== session.userId) {
    notFound();
  }

  // If order is not found or user unauthorized handled above
  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-10">
      <div className="container max-w-5xl mx-auto px-4">
        <PaymentClient order={JSON.parse(JSON.stringify(order))} />
      </div>
    </div>
  );
}
