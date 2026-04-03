import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Car, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  History,
  LayoutGrid
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { rupiahConverter } from "@/features/catalog/lib";
import OrderCalendar from "./admin/components/OrderCalendar";

/**
 * Dashboard land page.
 * Menampilkan ringkasan informasi yang berbeda untuk Admin dan Customer.
 */
export default async function DashboardPage() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId as number },
  });

  if (!user) {
    redirect("/auth/login");
  }

  // --- LOGIKA DATA UNTUK ADMIN ---
  if (user.role === "ADMIN") {
    const [totalOrders, totalRevenueData, totalProducts, totalCustomers] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: {
          status: { in: ["PAID", "PROCESSING", "COMPLETED"] },
        },
        _sum: { totalAmount: true },
      }),
      prisma.product.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    const totalRevenue = Number(totalRevenueData._sum.totalAmount || 0);

    const pendingWork = await prisma.order.count({
      where: { status: { in: ["PAID", "PROCESSING"] } },
    });

    const recentOrders = await prisma.order.findMany({
      include: {
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 1000 // Limit to avoid massive payload, usually would limit by date range
    });

    return (
      <main className="w-full px-4 lg:px-8 py-8 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-black font-montserrat tracking-tight text-foreground uppercase">
            Admin Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau performa bisnis Veteran Variasi dalam satu panel kendali.
          </p>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Pendapatan"
            value={rupiahConverter(totalRevenue)}
            icon={<DollarSign className="w-5 h-5" />}
            description="Dari pesanan lunas & selesai"
          />
          <StatCard
            title="Total Pesanan"
            value={totalOrders.toString()}
            icon={<ShoppingBag className="w-5 h-5" />}
            description="Keseluruhan transaksi"
          />
          <StatCard
            title="Total Produk"
            value={totalProducts.toString()}
            icon={<Package className="w-5 h-5" />}
            description="Aksesoris & Layanan aktif"
          />
          <StatCard
            title="Total Pelanggan"
            value={totalCustomers.toString()}
            icon={<Users className="w-5 h-5" />}
            description="User terdaftar aktif"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-sm h-full">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" /> Akses Cepat Kelola
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickLinkButton 
                  href="/dashboard/admin/orders" 
                  title="Lihat Pesanan Masuk"
                  subtitle={`${pendingWork} pesanan perlu penanganan`}
                  icon={<ShoppingBag className="w-6 h-6" />}
                />
                <QuickLinkButton 
                  href="/dashboard/admin/products" 
                  title="Kelola Katalog Produk"
                  subtitle="Update stok & harga produk"
                  icon={<Package className="w-6 h-6" />}
                />
              </div>
            </div>
          </div>

          {/* Pending Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-2">Perlu Diproses</h4>
              <p className="text-5xl font-black text-primary font-montserrat">{pendingWork}</p>
              <p className="text-sm text-foreground/70 mt-4 leading-relaxed">
                Terdapat <span className="font-bold underline">{pendingWork} pesanan</span> yang saat ini berstatus sedang dikerjakan atau menunggu pengerjaan. Segera selesaikan untuk meningkatkan kepuasan pelanggan.
              </p>
            </div>
            <Button asChild className="mt-8 rounded-xl font-bold py-6">
              <Link href="/dashboard/admin/orders" className="flex items-center gap-2">
                Buka Manajemen Pesanan <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Orders Calendar View */}
        <OrderCalendar orders={recentOrders as any} />
      </main>
    );
  }

  // --- LOGIKA DATA UNTUK CUSTOMER ---
  const [totalCars, activeOrders, completedOrders] = await Promise.all([
    prisma.car.count({ where: { userId: user.id } }),
    prisma.order.count({
      where: {
        userId: user.id,
        status: { in: ["PENDING", "PAID", "PROCESSING"] },
      },
    }),
    prisma.order.count({
      where: {
        userId: user.id,
        status: "COMPLETED",
      },
    }),
  ]);

  return (
    <main className="w-full px-4 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-montserrat tracking-tight text-foreground uppercase">
          Halo, {user.name.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang kembali di dashboard Anda. Berikut ringkasan aktivitas Anda.
        </p>
      </div>

      {/* Customer Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Pesanan Aktif"
          value={activeOrders.toString()}
          icon={<Clock className="w-5 h-5" />}
          description="Masih dalam proses"
        />
        <StatCard
          title="Pesanan Selesai"
          value={completedOrders.toString()}
          icon={<CheckCircle2 className="w-5 h-5" />}
          description="Riwayat belanja Anda"
        />
        <StatCard
          title="Kendaraan Saya"
          value={totalCars.toString()}
          icon={<Car className="w-5 h-5" />}
          description="Terdaftar di sistem"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border/60 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            Apa yang ingin Anda lakukan?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickLinkButton 
              href="/catalog" 
              title="Telusuri Katalog"
              subtitle="Cari produk & layanan"
              icon={<SearchIcon className="w-6 h-6" />}
            />
            <QuickLinkButton 
              href="/dashboard/user/orders" 
              title="Lihat Pesanan"
              subtitle="Cek status pengerjaan"
              icon={<History className="w-6 h-6" />}
            />
          </div>
        </div>

        <div className="bg-muted/30 border-2 border-dashed border-border/80 rounded-3xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-background border rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h4 className="font-bold text-lg mb-2">Ingin menambah mobil baru?</h4>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Daftarkan kendaraan Anda agar memudahkan proses booking di Veteran Variasi.
          </p>
          <Button asChild className="rounded-xl font-bold px-8">
            <Link href="/dashboard/user/cars">Daftarkan Sekarang</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, description }: { 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  description: string
}) {
  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
      <p className="text-2xl font-black text-foreground font-montserrat tracking-tight mb-1">{value}</p>
      <p className="text-[10px] text-muted-foreground/80 font-semibold">{description}</p>
    </div>
  );
}

function QuickLinkButton({ href, title, subtitle, icon }: { 
  href: string, 
  title: string, 
  subtitle: string, 
  icon: React.ReactNode 
}) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-4 p-5 bg-muted/40 rounded-2xl border border-border/40 hover:bg-primary/5 hover:border-primary/50 transition-all group"
    >
      <div className="w-12 h-12 bg-background border border-border/50 rounded-xl flex items-center justify-center text-primary shadow-xs group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-foreground mb-0.5">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium truncate">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

function SearchIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
