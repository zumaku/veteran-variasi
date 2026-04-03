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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/lib/toast-store";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction } from "@/features/admin/actions";
import {
  PackageOpen,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tempStatus, setTempStatus] = useState<string | null>(null);
  const [tempOrderId, setTempOrderId] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-[10px] font-bold inline-flex gap-1 items-center"><CheckCircle2 className="w-3 h-3"/> SELESAI</span>;
      case "CANCELLED":
        return <span className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-[10px] font-bold inline-flex gap-1 items-center"><XCircle className="w-3 h-3"/> DIBATALKAN</span>;
      case "PROCESSING":
        return <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold inline-flex gap-1 items-center"><Clock className="w-3 h-3"/> DIKERJAKAN</span>;
      case "PAID":
        return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold inline-block">LUNAS</span>;
      case "PENDING":
      default:
        return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded text-[10px] font-bold inline-block">PENDING</span>;
    }
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    setTempOrderId(orderId);
    setTempStatus(newStatus);
    setIsConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!tempOrderId || !tempStatus) return;

    setLoadingId(tempOrderId);
    const res = await updateOrderStatusAction(
      tempOrderId,
      tempStatus as OrderStatus,
    );
    if (res.success) {
      toast.success("Status pesanan diperbarui!");
      setOrders(
        orders.map((o) =>
          o.id === tempOrderId ? { ...o, status: tempStatus } : o,
        ),
      );
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
    setLoadingId(null);
    setIsConfirmOpen(false);
    setTempOrderId(null);
    setTempStatus(null);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-card border-2 border-dashed border-border/60 rounded-3xl p-16 text-center">
        <PackageOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Tidak ada pesanan masuk</h3>
        <p className="text-muted-foreground mb-6">Sistem belum menerima pemesanan dari pelanggan manapun.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm bg-card pb-2">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/40 text-muted-foreground text-[11px] font-bold tracking-wider uppercase border-b border-border/50">
          <tr>
            <th className="px-6 py-4 font-semibold">Pesanan</th>
            <th className="px-6 py-4 font-semibold">Pelanggan & Kendaraan</th>
            <th className="px-6 py-4 font-semibold">Total Tagihan</th>
            <th className="px-6 py-4 font-semibold text-right">Aksi & Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {orders.map((order) => {
             return (
               <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 align-middle">
                    <p className="font-mono text-xs font-bold text-foreground bg-muted w-fit px-1.5 py-0.5 rounded mb-1">
                      #{order.orderNumber.substring(order.orderNumber.length - 8)}
                    </p>
                    <p className="text-[11px] text-muted-foreground whitespace-nowrap mb-2">
                      {format(new Date(order.createdAt), "dd MMM yy, HH:mm", { locale: localeId })}
                    </p>
                    <div>{getStatusBadge(order.status)}</div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <p className="font-bold text-sm text-foreground truncate max-w-[200px]">
                      {order.user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold truncate max-w-[200px] mt-0.5">
                      {order.car?.brand} {order.car?.model}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <p className="font-bold text-sm text-priamry">{rupiahConverter(order.totalAmount)}</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wider">
                      {(order.paymentToken || order.paymentMethod).replace(/_/g, " ")}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="w-44 text-left">
                        <Select
                           value={order.status}
                           onValueChange={(val) => handleStatusChange(order.id, val)}
                           disabled={loadingId === order.id}
                        >
                          <SelectTrigger className="h-9 w-full rounded-lg bg-background border-border/60 shadow-xs font-semibold text-xs transition-colors hover:border-border">
                             <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent>
                             {order.status === "PENDING" && <SelectItem value="PENDING" className="text-xs">Menunggu Bayar</SelectItem>}
                             <SelectItem value="PAID" className="text-xs">Menunggu Pengerjaan</SelectItem>
                             <SelectItem value="PROCESSING" className="text-xs">Sedang Dikerjakan</SelectItem>
                             <SelectItem value="COMPLETED" className="text-xs">Selesai / Diambil</SelectItem>
                             <SelectItem value="CANCELLED" className="text-red-500 font-semibold focus:text-red-600 focus:bg-red-50 text-xs">Batalkan Pesanan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Link 
                        href={`/dashboard/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-lg transition-colors border border-border/50 h-9"
                      >
                        Detail <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
               </tr>
             )
          })}
        </tbody>
      </table>

      {/* Status Change Confirmation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Perubahan Status</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mengubah status pesanan ini menjadi{" "}
              <span className="font-bold text-foreground">
                {tempStatus === "PAID"
                  ? "Menunggu Pengerjaan"
                  : tempStatus === "PROCESSING"
                    ? "Sedang Dikerjakan"
                    : tempStatus === "COMPLETED"
                      ? "Selesai"
                      : tempStatus === "CANCELLED"
                        ? "Dibatalkan"
                        : tempStatus}
              </span>
              ? Perubahan ini akan langsung terlihat oleh pelanggan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loadingId !== null}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className={
                tempStatus === "CANCELLED"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-primary hover:bg-primary text-white font-bold"
              }
              onClick={(e) => {
                e.preventDefault();
                confirmStatusChange();
              }}
              disabled={loadingId !== null}
            >
              Ya, Ubah Sekarang
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
