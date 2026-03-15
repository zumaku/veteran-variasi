import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { getCarBySlug } from "@/features/garage/data/cars";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ChevronLeft,
  Edit3,
  Calendar,
  Tag,
  Hash,
  History,
  Settings,
} from "lucide-react";

interface CarDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { slug } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userId = (session as any).userId;
  const car = await getCarBySlug(slug);

  if (!car || car.userId !== userId) {
    notFound();
  }

  const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
    }).format(new Date(date));
  };

  const formatFullDate = (date: string | Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard/user/profile"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors group mb-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Garasi
          </Link>
          <h1 className="text-4xl font-black tracking-tight">
            {car.brand} {car.model}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Tahun Rilis: {car.year}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href={`/dashboard/user/garage/${car.slug}/edit`}>
            <Button
              variant="outline"
              className="rounded-xl h-11 px-6 font-bold flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Mobil
            </Button>
          </Link>
          <Button
            variant="dark"
            className="rounded-xl h-11 px-6 font-bold flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Service Baru
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative aspect-video rounded-3xl overflow-hidden">
          <Image
            src={car.image || "/top-down-car.png"}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Informasi Kendaraan
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">
                    Nomer Plat
                  </p>
                  <p className="text-xl font-black flex items-center gap-2">
                    {car.licensePlate}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">
                    Tahun
                  </p>
                  <p className="text-xl font-black flex items-center gap-2">
                    {car.year}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">
                    Merek
                  </p>
                  <p className="text-xl font-black flex items-center gap-2">
                    {car.brand}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700">
                  <p className="text-xs uppercase tracking-widest font-bold opacity-50 mb-1">
                    Model
                  </p>
                  <p className="text-xl font-black flex items-center gap-2">
                    {car.model}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-3xl p-6 border border-primary/20">
            <p className="text-sm font-medium mb-1">Terdaftar Sejak</p>
            <p className="text-lg font-bold">{formatDate(car.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Service History */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6" />
          Riwayat Service
        </h2>

        {car.orders && car.orders.length > 0 ? (
          <div className="grid gap-4">
            {car.orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
              >
                <div className="space-y-1">
                  <p className="font-bold text-lg">
                    {formatFullDate(order.bookingDate)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item: any) => (
                      <span
                        key={item.id}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full border"
                      >
                        {item.product.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold opacity-60">
                    #{order.orderNumber}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-12 border border-dashed text-center space-y-4">
            <div className="bg-zinc-200 dark:bg-zinc-800 h-16 w-16 rounded-full flex items-center justify-center mx-auto opacity-50">
              <History className="h-8 w-8" />
            </div>
            <div className="max-w-xs mx-auto">
              <p className="font-bold text-lg">Belum ada riwayat service</p>
              <p className="text-muted-foreground text-sm">
                Mobil ini belum pernah melakukan service atau pembelian
                aksesoris.
              </p>
            </div>
            <Button variant="outline" className="rounded-xl">
              Mulai Booking Service
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
