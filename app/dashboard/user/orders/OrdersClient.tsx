"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { rupiahConverter } from "@/features/catalog/lib";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast-store";
import { submitReviewAction } from "@/features/review/actions";
import {
  Clock,
  CheckCircle2,
  XCircle,
  PackageOpen,
  ChevronRight,
  Star,
  MessageSquarePlus,
  BadgeCheck,
  CreditCard,
  ClipboardList,
  Wrench,
} from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Menunggu Pembayaran", icon: CreditCard },
  { key: "PAID", label: "Menunggu Pengerjaan", icon: ClipboardList },
  { key: "PROCESSING", label: "Sedang Dikerjakan", icon: Wrench },
  { key: "COMPLETED", label: "Selesai", icon: BadgeCheck },
];

function getStepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function OrderStatusCompact({ status }: { status: string }) {
  const activeIdx = getStepIndex(status);
  const step = STEPS[activeIdx] || STEPS[0];
  const IconComp = step.icon;

  return (
    <div className="flex items-center gap-2 bg-muted/50 dark:bg-muted/10 px-3 py-2 rounded-xl border border-border/50">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center
        ${status === "COMPLETED" ? "bg-green-500 text-white" : "bg-primary text-white animate-pulse"}
      `}
      >
        <IconComp className="w-4 h-4" />
      </div>
      <div className="flex flex-col">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider leading-none mb-0.5">
          Status Sekarang
        </p>
        <p
          className={`text-xs font-black
          ${status === "COMPLETED" ? "text-green-600 dark:text-green-400" : "text-primary"}
        `}
        >
          {step.label}
        </p>
      </div>
    </div>
  );
}

function ReviewDialog({
  orderId,
  onSuccess,
}: {
  orderId: number;
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Pilih bintang rating terlebih dahulu.");
      return;
    }
    setLoading(true);
    const res = await submitReviewAction(orderId, rating, comment);
    setLoading(false);
    if (res.success) {
      toast.success("Ulasan berhasil dikirim! Terima kasih.");
      setOpen(false);
      onSuccess();
    } else {
      toast.error(res.error || "Gagal mengirim ulasan.");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <MessageSquarePlus className="w-3.5 h-3.5" /> Beri Ulasan
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">
              Beri Ulasan Pengerjaan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Star Rating */}
            <div>
              <p className="text-sm font-semibold mb-3 text-foreground">
                Rating Keseluruhan
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors text-yellow-500 ${
                        star <= (hovered || rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {
                    [
                      "",
                      "Sangat Buruk",
                      "Buruk",
                      "Cukup",
                      "Bagus",
                      "Luar Biasa",
                    ][rating]
                  }
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <p className="text-sm font-semibold mb-2 text-foreground">
                Komentar{" "}
                <span className="font-normal text-muted-foreground">
                  (opsional)
                </span>
              </p>
              <Textarea
                placeholder="Ceritakan pengalaman Anda dengan layanan kami..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none rounded-xl"
                maxLength={500}
              />
              <p className="text-[10px] text-muted-foreground text-right mt-1">
                {comment.length}/500
              </p>
            </div>

            <Button onClick={handleSubmit} disabled={loading || rating === 0}>
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders: any[];
}) {
  const [orders, setOrders] = useState(initialOrders);

  const markReviewed = (orderId: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, review: { id: -1 } } : o)),
    );
  };

  if (orders.length === 0) {
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

  return (
    <div className="grid gap-6">
      {orders.map((order) => {
        const isPending =
          order.status === "PENDING" &&
          !(
            order.expiredAt &&
            new Date(order.expiredAt).getTime() < new Date().getTime()
          );
        const isCancelled =
          order.status === "CANCELLED" ||
          (order.status === "PENDING" &&
            order.expiredAt &&
            new Date(order.expiredAt).getTime() < new Date().getTime());
        const isCompleted = order.status === "COMPLETED";
        const hasReview = !!order.review;

        const firstItem = order.items[0];
        const extraItemsCount = order.items.length - 1;

        return (
          <div
            key={order.id}
            className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
              {isCancelled && (
                <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold w-fit">
                  <XCircle className="w-4 h-4" /> Dibatalkan
                </div>
              )}
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
                    <p className="font-bold text-lg text-primary">
                      {rupiahConverter(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Metode Pembayaran
                    </p>
                    <div className="text-sm text-muted-foreground font-medium flex items-center gap-1.5 ">
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
            <div className="px-6 py-2 bg-muted/10 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
              {/* Status on Left */}
              <div className="shrink-0">
                {!isCancelled && <OrderStatusCompact status={order.status} />}
              </div>

              {/* Action Buttons on Right */}
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/user/payment/${order.id}`}>
                    Lihat Detail
                  </Link>
                </Button>

                {isPending && (
                  <Button asChild>
                    <Link href={`/dashboard/user/payment/${order.id}`}>
                      Bayar Sekarang{" "}
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Link>
                  </Button>
                )}

                {isCompleted && !hasReview && (
                  <ReviewDialog
                    orderId={order.id}
                    onSuccess={() => markReviewed(order.id)}
                  />
                )}

                {isCompleted && hasReview && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-lg border border-green-200 dark:border-green-800">
                    <BadgeCheck className="w-3.5 h-3.5" /> Sudah Diulas
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
