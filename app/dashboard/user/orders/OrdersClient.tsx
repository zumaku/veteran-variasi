"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { rupiahConverter } from "@/features/catalog/lib";
import {
  Clock,
  CheckCircle2,
  XCircle,
  PackageOpen,
  ChevronRight,
} from "lucide-react";

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  if (initialOrders.length === 0) {
    return (
      <div className="bg-muted/30 border-2 border-dashed border-border/60 rounded-3xl p-12 text-center">
        <PackageOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Belum ada pesanan</h3>
        <p className="text-muted-foreground mb-6">
          Anda belum pernah melakukan pemesanan layanan di Veteran Variasi.
        </p>
        <Button asChild className="rounded-xl px-8 font-bold">
          <Link href="/">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  const getStatusDisplay = (status: string, expiredAt: string) => {
    const isExpired =
      expiredAt && new Date(expiredAt).getTime() < new Date().getTime();

    if (status === "PAID") {
      return (
        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit">
          <CheckCircle2 className="w-4 h-4" /> Lunas
        </div>
      );
    }
    if (status === "CANCELLED" || (status === "PENDING" && isExpired)) {
      return (
        <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit">
          <XCircle className="w-4 h-4" /> Dibatalkan
        </div>
      );
    }
    if (status === "PROCESSING") {
      return (
        <div className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit">
          <Clock className="w-4 h-4" /> Diproses
        </div>
      );
    }
    if (status === "COMPLETED") {
      return (
        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit">
          <CheckCircle2 className="w-4 h-4" /> Selesai
        </div>
      );
    }
    return (
      <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit">
        <Clock className="w-4 h-4" /> Menunggu Pembayaran
      </div>
    );
  };

  return (
    <div className="grid gap-6">
      {initialOrders.map((order) => {
        const isPending =
          order.status === "PENDING" &&
          !(
            order.expiredAt &&
            new Date(order.expiredAt).getTime() < new Date().getTime()
          );
        const firstItem = order.items[0];
        const extraItemsCount = order.items.length - 1;

        return (
          <div
            key={order.id}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm tracking-tight">
                  #{order.orderNumber}
                </span>
                <span className="text-muted-foreground/40 hidden sm:block">
                  •
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", {
                    locale: id,
                  })}
                </span>
              </div>
              {getStatusDisplay(order.status, order.expiredAt)}
            </div>

            {/* Body */}
            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Product Detail */}
                <div className="flex-1 min-w-0">
                  <div className="flex gap-4">
                    <div className="relative aspect-square w-24 shrink-0 bg-muted rounded-xl border overflow-hidden flex items-center justify-center">
                      {firstItem?.product.images?.[0]?.url ? (
                        <Image
                          src={firstItem.product.images[0].url}
                          alt={firstItem.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <PackageOpen className="w-8 h-8 text-muted-foreground/30 relative z-10" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="font-bold text-base leading-tight line-clamp-2 mb-1">
                        {firstItem?.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        {firstItem?.quantity} x{" "}
                        {rupiahConverter(firstItem?.priceAtBooking)}
                      </p>
                      {extraItemsCount > 0 && (
                        <p className="text-xs font-semibold text-muted-foreground bg-muted w-fit px-2 py-0.5 rounded">
                          +{extraItemsCount} produk lainnya
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Pelaksanaan
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {order.bookingDate
                        ? format(new Date(order.bookingDate), "dd MMM yyyy", {
                            locale: id,
                          })
                        : "-"}
                      <span className="text-muted-foreground ml-1">
                        (Sesi {order.timeSlot})
                      </span>
                    </p>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-border/50" />

                {/* Meta */}
                <div className="md:w-64 shrink-0 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Belanja
                    </p>
                    <p className="font-bold text-lg text-[#FFB800]">
                      {rupiahConverter(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Metode Pembayaran
                    </p>
                    <div className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                      {order.paymentToken && (
                        <span className="font-bold text-foreground">
                          {order.paymentToken.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/10 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 sm:flex-none h-10 rounded-lg"
                >
                  <Link href={`/dashboard/user/payment/${order.id}`}>
                    Lihat Detail
                  </Link>
                </Button>

                {isPending && (
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 sm:flex-none h-10 bg-[#FFB800] text-black hover:bg-[#FFB800]/90 font-bold rounded-lg shadow-sm"
                  >
                    <Link href={`/dashboard/user/payment/${order.id}`}>
                      Bayar Sekarang <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
