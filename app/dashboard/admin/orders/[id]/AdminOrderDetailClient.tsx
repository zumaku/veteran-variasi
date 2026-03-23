"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { rupiahConverter } from "@/features/catalog/lib";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast-store";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/features/admin/actions";
import {
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  CreditCard,
  Box,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminOrderDetailClient({
  order: initialOrder,
}: {
  order: any;
}) {
  const [order, setOrder] = useState(initialOrder);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold inline-flex gap-1.5 items-center">
            <CheckCircle2 className="w-4 h-4" /> SELESAI
          </span>
        );
      case "CANCELLED":
        return (
          <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold inline-flex gap-1.5 items-center">
            <XCircle className="w-4 h-4" /> DIBATALKAN
          </span>
        );
      case "PROCESSING":
        return (
          <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold inline-flex gap-1.5 items-center">
            <Clock className="w-4 h-4" /> DIKERJAKAN
          </span>
        );
      case "PAID":
        return (
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
            LUNAS
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-bold inline-block">
            PENDING
          </span>
        );
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    const res = await updateOrderStatusAction(
      order.id,
      newStatus as OrderStatus,
    );
    if (res.success) {
      toast.success("Status pesanan diperbarui!");
      setOrder({ ...order, status: newStatus });
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
    setIsUpdating(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* 2/3 Column: Info Customer, Mobil, dan Item */}
      <div className="xl:col-span-2 space-y-6">
        {/* Customer & Car Info Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm min-w-0">
            <h3 className="text-base font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-3 text-foreground">
              <User className="w-5 h-5 text-muted-foreground" /> Informasi
              Pelanggan
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 min-w-0">
                {order.user?.image_url ? (
                  <img
                    src={order.user.image_url}
                    alt={order.user?.name || "User Profile"}
                    className="rounded-full object-cover shrink-0 w-10 h-10 border border-border/50 bg-muted/50"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted border border-border/50 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-semibold mb-0.5">
                    Nama Lengkap
                  </p>
                  <p className="font-bold text-foreground text-sm truncate">
                    {order.user?.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> No. HP
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {order.user?.phone || "-"}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </p>
                  <p
                    className="text-sm font-semibold text-foreground truncate"
                    title={order.user?.email}
                  >
                    {order.user?.email}
                  </p>
                </div>
              </div>
              {order.user?.address && (
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Alamat
                  </p>
                  <p className="text-sm text-foreground">
                    {order.user?.address}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm min-w-0">
            <h3 className="text-base font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-3 text-foreground">
              <Car className="w-5 h-5 text-muted-foreground" /> Data Kendaraan
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 min-w-0">
                {order.car?.image ? (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image
                      src={order.car.image}
                      alt={order.car?.brand || "Car Image"}
                      width={1000}
                      height={1000}
                      className="aspect-square object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-muted border border-border/50 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground font-semibold mb-0.5">
                    Merk & Model
                  </p>
                  <div className="font-bold flex items-center gap-2 text-sm text-foreground flex-wrap">
                    <p className="truncate">
                      {order.car?.brand} {order.car?.model}
                    </p>
                    <span className="bg-muted px-2 py-0.5 rounded text-[11px] font-mono border border-border/50 shrink-0">
                      {order.car?.licensePlate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Jadwal Pelaksanaan
                </p>
                <p className="text-sm font-semibold text-foreground truncate">
                  {order.bookingDate
                    ? format(
                        new Date(order.bookingDate),
                        "EEEE, dd MMMM yyyy",
                        { locale: localeId },
                      )
                    : "Tanpa Jadwal"}
                </p>
                {order.timeSlot && (
                  <p className="text-xs bg-[#FFB800]/10 text-[#FFB800] font-bold px-2 py-1 rounded w-fit mt-1.5">
                    Sesi {order.timeSlot}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Item List Box */}
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm min-w-0">
          <h3 className="text-base font-bold flex items-center gap-2 mb-5 border-b border-border/50 pb-3 text-foreground">
            <Box className="w-5 h-5 text-muted-foreground" /> Daftar Produk &
            Layanan
          </h3>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-muted/40 p-3 rounded-xl border border-border/30 hover:bg-muted/70 transition-colors"
              >
                <div className="flex gap-4 flex-1 min-w-0">
                  <Link
                    href={`/catalog/${item.product.slug}`}
                    className="w-16 h-16 rounded-lg bg-muted border border-border/60 overflow-hidden shrink-0 relative flex items-center justify-center hover:opacity-80 transition-opacity aspect-square"
                  >
                    {item.product?.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Box className="w-6 h-6 text-muted-foreground/30" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <Link
                      href={`/catalog/${item.product.slug}`}
                      className="font-bold text-sm text-foreground mb-1 truncate hover:text-[#FFB800] hover:underline underline-offset-2 decoration-[#FFB800]/50 transition-all block w-fit max-w-full"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground font-semibold truncate">
                      {rupiahConverter(item.priceAtBooking)}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right pl-20 sm:pl-0 shrink-0">
                  <p className="text-sm text-muted-foreground">
                    x
                    <span className="font-bold text-lg text-foreground">
                      {item.quantity}
                    </span>
                  </p>
                  <p className="text-sm font-bold text-[#FFB800] mt-1">
                    {rupiahConverter(item.priceAtBooking * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 1/3 Column: Payment Tagihan & Status */}
      <div className="space-y-6">
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm sticky top-24">
          {/* Current Status Box */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground mb-3">
              Status Pengerjaan Saat Ini
            </p>
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
              <p className="text-xs font-semibold mb-2 text-foreground">
                Ubah Status
              </p>
              <Select
                value={order.status}
                onValueChange={(val) => handleStatusChange(val)}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-11 w-full rounded-md bg-background border-border font-bold shadow-xs">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {order.status === "PENDING" && (
                    <SelectItem value="PENDING">Menunggu Bayar</SelectItem>
                  )}
                  <SelectItem value="PAID">Menunggu Pengerjaan</SelectItem>
                  <SelectItem value="PROCESSING">Sedang Dikerjakan</SelectItem>
                  <SelectItem value="COMPLETED">Selesai / Diambil</SelectItem>
                  <SelectItem
                    value="CANCELLED"
                    className="text-red-500 font-semibold focus:text-red-600 focus:bg-red-50"
                  >
                    Batalkan Pesanan
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <hr className="border-border/60 mb-6" />

          {/* Payment Information */}
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-foreground">
              <CreditCard className="w-4 h-4 text-muted-foreground" /> Informasi
              Transaksi
            </h3>
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex flex-wrap gap-2 justify-between items-center text-muted-foreground">
                <p>Metode Pembayaran</p>
                <p className="uppercase text-foreground">
                  {(order.paymentToken || order.paymentMethod).replace(
                    /_/g,
                    " ",
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-between items-center text-muted-foreground">
                <p>Waktu Pemesanan</p>
                <p className="text-foreground">
                  {format(new Date(order.createdAt), "dd MMM yy, HH:mm", {
                    locale: localeId,
                  })}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-between items-center text-muted-foreground">
                <p>Status Tagihan</p>
                <p
                  className={
                    order.status !== "PENDING" && order.status !== "CANCELLED"
                      ? "text-green-600 dark:text-green-400 font-bold"
                      : "text-orange-500 dark:text-orange-400 font-bold"
                  }
                >
                  {order.status === "PENDING"
                    ? "Belum Dibayar"
                    : order.status === "CANCELLED"
                      ? "Dibatalkan"
                      : "Lunas"}
                </p>
              </div>
              <div className="pt-4 mt-2 border-t border-dashed border-border flex flex-wrap gap-2 justify-between items-center">
                <p className="font-bold text-foreground text-sm">
                  Total Tagihan
                </p>
                <p className="text-2xl font-black text-[#FFB800] font-montserrat tracking-tight">
                  {rupiahConverter(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
