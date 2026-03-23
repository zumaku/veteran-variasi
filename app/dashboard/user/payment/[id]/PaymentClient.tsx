"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast-store";
import { rupiahConverter } from "@/features/catalog/lib";
import {
  cancelOrderAction,
  simulatePaymentAction,
} from "@/features/checkout/actions";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Download,
  ChevronLeft,
  Wallet,
  CarFront,
  Calendar,
  AlertTriangle,
  PackageOpen,
} from "lucide-react";

export const PAYMENT_LOGOS: Record<string, string> = {
  GOPAY: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg",
  OVO: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg",
  DANA: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg",
  SHOPEEPAY: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
  LINKAJA: "https://upload.wikimedia.org/wikipedia/commons/8/85/LinkAja.svg",
  VA_BCA:
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
  VA_MANDIRI:
    "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg",
  VA_BNI:
    "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg",
  VA_BRI: "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg",
  VA_PERMATA:
    "https://upload.wikimedia.org/wikipedia/id/4/48/PermataBank_logo.svg",
  VA_CIMB:
    "https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg",
  VA_BSI:
    "https://upload.wikimedia.org/wikipedia/commons/6/69/Bank_Syariah_Indonesia.jpg",
  QRIS: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg",
  OTC_INDOMARET:
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Indomaret.png",
  OTC_ALFAMART:
    "https://upload.wikimedia.org/wikipedia/commons/8/86/Alfamart_logo.svg",
  CC_VISA:
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg",
  CC_MASTERCARD:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  CC_JCB: "https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg",
  CC_AMEX:
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg",
};

export default function PaymentClient({ order }: { order: any }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number;
    seconds: number;
  }>({ minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Constants
  const isPaid = order.status === "PAID";
  const isCancelled = order.status === "CANCELLED" || isExpired;
  const isPending = order.status === "PENDING" && !isExpired;

  // Virtual Account / Payment Code mock based on order orderNumber
  const paymentCode = `8923${order.id.toString().padStart(6, "0")}`;

  useEffect(() => {
    if (order.status !== "PENDING" || !order.expiredAt) return;

    const expiryTime = new Date(order.expiredAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ minutes: 0, seconds: 0 });
        if (order.status === "PENDING") {
          // Soft update locally, in a real app might trigger a background expiry check
        }
        return;
      }

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft({ minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.expiredAt, order.status]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke papan klip");
  };

  const handleCancel = async () => {
    if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      setIsCancelling(true);
      const res = await cancelOrderAction(order.id);
      setIsCancelling(false);

      if (res.success) {
        toast.success("Pesanan berhasil dibatalkan");
        router.refresh(); // Refresh page to get updated status from DB
      } else {
        toast.error(res.error || "Gagal membatalkan pesanan");
      }
    }
  };

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    const res = await simulatePaymentAction(order.id);
    setIsSimulating(false);

    if (res.success) {
      toast.success("Pembayaran berhasil!");
      router.refresh(); // Refresh to trigger PAID status rendering
    } else {
      toast.error(res.error || "Gagal menyimulasikan pembayaran");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Status Badge Helper
  const getStatusBadge = () => {
    if (isPaid) {
      return (
        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold max-w-fit mx-auto print:bg-transparent print:text-black">
          <CheckCircle2 className="w-5 h-5" />
          Pembayaran Berhasil
        </div>
      );
    }
    if (isCancelled) {
      return (
        <div className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold max-w-fit mx-auto print:bg-transparent print:text-black">
          <XCircle className="w-5 h-5" />
          Pesanan Dibatalkan{" "}
          {isExpired && order.status === "PENDING" && "(Kadaluarsa)"}
        </div>
      );
    }
    return (
      <div className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold max-w-fit mx-auto print:bg-transparent print:text-black">
        <Clock className="w-5 h-5" />
        Menunggu Pembayaran
      </div>
    );
  };

  return (
    <div className="max-w-3xl mt-8 mx-auto pb-10 print:max-w-full print:p-0">
      {/* Header (Hidden in Print) */}
      <div className="mb-6 print:hidden">
        <Link
          href="/dashboard/user/orders"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Pesananku
        </Link>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm print:shadow-none print:border-none print:bg-white print:text-black">
        {/* Print Only Header */}
        <div className="hidden print:block text-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-black font-montserrat tracking-tight mb-2">
            VETERAN VARIASI
          </h1>
          <p className="text-sm text-gray-500">
            Nota Pembelian & Bukti Booking
          </p>
        </div>

        {/* Status Section */}
        <div className="text-center space-y-4 mb-8">
          {getStatusBadge()}

          {isPending && (
            <div className="space-y-2 mt-4 print:hidden">
              <p className="text-muted-foreground text-sm">
                Selesaikan pembayaran dalam waktu
              </p>
              <div className="text-4xl font-black font-montserrat text-[#FFB800] tracking-tight">
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <p className="text-xs text-muted-foreground bg-muted inline-block px-3 py-1 rounded-full mt-2">
                Batas Akhir:{" "}
                {format(new Date(order.expiredAt), "dd MMM yyyy, HH:mm", {
                  locale: id,
                })}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Order Summary Box */}
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 print:bg-transparent print:border-gray-200">
            <h2 className="text-lg font-bold mb-4 font-montserrat flex items-center justify-between border-b border-border/50 pb-3 print:border-gray-200">
              <span>Detail Pesanan</span>
              <span className="text-muted-foreground text-sm font-medium">
                #{order.orderNumber}
              </span>
            </h2>

            <div className="space-y-5">
              {/* Product Info */}
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-muted rounded-xl shrink-0 flex items-center justify-center overflow-hidden border print:border-gray-200">
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <PackageOpen className="w-6 h-6 text-muted-foreground/30 print:text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-bold text-[15px] leading-tight line-clamp-2">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.quantity} x {rupiahConverter(item.priceAtBooking)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50 print:border-gray-200">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-semibold">
                    <CarFront className="w-3.5 h-3.5" /> Kendaraan
                  </p>
                  <div className="flex items-center gap-3">
                    {order.car?.image ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted border print:border-gray-200 shrink-0 relative">
                        <Image
                          src={order.car.image}
                          alt={order.car.brand}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted border print:border-gray-200 shrink-0 flex items-center justify-center">
                        <CarFront className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm leading-tight">
                        {order.car?.brand} {order.car?.model}
                      </p>
                      <p className="inline-block bg-muted px-2 py-0.5 rounded text-xs mt-1 font-medium print:border print:border-gray-200">
                        {order.car?.licensePlate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5" /> Jadwal Booking
                  </p>
                  <p className="font-bold text-sm">
                    {order.bookingDate
                      ? format(new Date(order.bookingDate), "dd MMMM yyyy", {
                          locale: id,
                        })
                      : "-"}
                    <span className="bg-muted px-2 py-0.5 rounded text-xs ml-1 print:border print:border-gray-200">
                      Sesi {order.timeSlot}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Instructions / Bill */}
          <div className="bg-background rounded-2xl p-6 border-2 border-[#FFB800]/20 shadow-sm print:border-none print:shadow-none print:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:mb-4 pb-4 border-b border-border/50 print:border-gray-200">
              <div>
                <p className="text-sm text-muted-foreground font-semibold flex items-center gap-1.5 mb-2">
                  <Wallet className="w-4 h-4" /> Metode Pembayaran
                </p>
                <div className="flex items-center gap-3">
                  {PAYMENT_LOGOS[order.paymentToken || order.paymentMethod] && (
                    <div className="bg-white p-1.5 rounded-md border border-border/50 shrink-0 h-8 flex items-center justify-center print:border-gray-300">
                      <Image
                        src={
                          PAYMENT_LOGOS[
                            order.paymentToken || order.paymentMethod
                          ]
                        }
                        alt="Logo"
                        width={48}
                        height={20}
                        className="w-auto h-full object-contain"
                      />
                    </div>
                  )}
                  <p className="font-bold text-lg">
                    {(order.paymentToken || order.paymentMethod).replace(
                      /_/g,
                      " ",
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground font-semibold mb-1 print:text-left print:sm:text-right">
                  Total Tagihan
                </p>
                <p className="text-2xl font-black font-montserrat text-[#FFB800] tracking-tight print:text-black">
                  {rupiahConverter(order.totalAmount)}
                </p>
              </div>
            </div>

            {isPending && (
              <div className="space-y-4 print:hidden">
                <div className="bg-muted/50 p-4 rounded-xl border border-border/60">
                  <p className="text-sm font-semibold mb-2 text-foreground/80">
                    Kode Pembayaran / Virtual Account
                  </p>
                  <div className="flex items-center justify-between bg-background p-3 rounded-lg border-2 border-border focus-within:border-[#FFB800] transition-colors">
                    <span className="font-mono text-xl font-bold tracking-widest">
                      {paymentCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentCode)}
                      className="p-2 text-muted-foreground hover:text-[#FFB800] hover:bg-[#FFB800]/10 rounded-md transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-200 dark:border-orange-900/50 flex gap-3 text-orange-800 dark:text-orange-200">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-sm space-y-1">
                    <p className="font-bold">Instruksi Pembayaran:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>
                        Buka aplikasi Mobile Banking atau e-Wallet pendukung
                        Anda.
                      </li>
                      <li>
                        Pilih menu Transfer atau Pembayaran Tagihan / Virtual
                        Account.
                      </li>
                      <li>
                        Masukkan kode pembayaran{" "}
                        <span className="font-mono font-bold bg-orange-100 dark:bg-orange-900/40 px-1 rounded">
                          {paymentCode}
                        </span>
                        .
                      </li>
                      <li>
                        Pastikan nominal yang muncul sesuai, yaitu{" "}
                        <span className="font-bold">
                          {rupiahConverter(order.totalAmount)}
                        </span>
                        .
                      </li>
                      <li>
                        Selesaikan pembayaran. Status pesanan akan terupdate
                        otomatis (simulasi).
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions - Hidden in Print */}
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4 print:hidden">
          {isPaid && (
            <Button variant="default" onClick={handlePrint}>
              <Download className="w-5 h-5" />
              Download / Cetak Nota
            </Button>
          )}

          {isPending && (
            <>
              <Button
                variant="outline"
                onClick={handleSimulatePayment}
                disabled={isSimulating}
                className="text-green-600 hover:text-green-700"
              >
                {isSimulating ? "Memproses..." : "Simulasikan Pembayaran"}
              </Button>

              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Membatalkan..." : "Batalkan"}
              </Button>
            </>
          )}

          <Button asChild variant={isPending ? "default" : "outline"}>
            <Link href="/dashboard/user/orders">
              {isPaid ? "Lihat Semua Pesanan" : "Cek Status Pesanan"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
