"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShoppingCartIcon,
  Trash2,
  ChevronRight,
  PackageOpen,
} from "lucide-react";
import { rupiahConverter } from "@/features/catalog/lib";
import { toast } from "@/lib/toast-store";
import { getCartAction, removeFromCartAction } from "@/features/cart/actions";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: any;
    stock: number | null;
    images?: { url: string }[];
  };
};

type Cart = {
  id: number;
  items: CartItem[];
};

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    const result = await getCartAction();
    if (result.success && result.data) {
      setCart(result.data as Cart);
    }
    setIsLoading(false);
  };

  const handleRemove = async (itemId: number) => {
    setLoadingItemId(itemId);
    const result = await removeFromCartAction(itemId);
    if (!result.success) {
      toast.error(result.error || "Gagal menghapus item");
    } else {
      toast.success("Item berhasil dihapus dari keranjang");
      // Optimistically update UI
      setCart((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        };
      });
    }
    setLoadingItemId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">
            Memuat keranjang...
          </p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-foreground tracking-tight">
            Keranjang
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-card border rounded-md py-12 flex flex-col items-center justify-center min-h-[50vh] shadow-sm">
          <div className="w-24 h-24 mb-6 rounded-full bg-muted flex items-center justify-center">
            <ShoppingCartIcon className="w-12 h-12 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-bold mb-2 font-montserrat tracking-tight">
            Keranjang Anda kosong
          </h2>
          <p className="text-muted-foreground text-center max-w-md mb-8">
            Sepertinya Anda belum memilih layanan atau produk apa pun. Mari
            lihat katalog kami!
          </p>
          <Link href="/catalog">
            <Button
              size="lg"
              className="font-bold cursor-pointer px-8 bg-primary text-white hover:bg-primary/90 transition-all rounded-xl h-12"
            >
              Mulai Belanja
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border/60 rounded-2xl p-6 transition-all duration-300 relative flex flex-col sm:flex-row items-center justify-between min-h-[120px] hover:border-primary/50 hover:shadow-sm group"
            >
              {loadingItemId === item.id && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 backdrop-blur-[1px] rounded-[20px]">
                  <div className="h-6 w-6 rounded-full animate-spin"></div>
                </div>
              )}

              {/* Image and Content */}
              <div className="flex gap-4 items-center w-full sm:w-auto">
                {/* Image Placeholder */}
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center text-center p-2">
                  {item.product.images?.[0]?.url ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground italic font-medium text-[10px] leading-tight flex flex-col items-center gap-1">
                      <PackageOpen className="w-5 h-5 opacity-50" />
                      Tanpa Foto
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col py-1">
                  <Link
                    href={`/catalog/${item.product.slug}`}
                    className="font-bold text-[17px] leading-tight hover:text-primary transition-colors text-foreground line-clamp-2 pr-4"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-primary font-bold text-[16px] mt-2 font-montserrat tracking-tight">
                    {rupiahConverter(Number(item.product.price))}
                  </p>
                  {item.product.stock !== null && (
                    <p
                      className={`text-[11px] font-bold mt-1 ${item.product.stock > 0 ? "text-foreground" : "text-red-500"}`}
                    >
                      {item.product.stock > 0
                        ? `Stok tersedia: ${item.product.stock}`
                        : "Stok sedang habis"}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-5 sm:mt-0 w-full sm:w-auto justify-end pt-4 sm:pt-0 ">
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={loadingItemId === item.id}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer rounded-xl px-4 py-2 font-medium h-11 flex items-center justify-center gap-2 group/btn"
                >
                  <Trash2 className="w-4 h-4 group-hover/btn:hidden" />
                  <span className="hidden group-hover/btn:inline text-sm">
                    Hapus
                  </span>
                </button>

                <Link
                  href={
                    item.product.stock !== null && item.product.stock <= 0
                      ? "#"
                      : `/dashboard/user/checkout?item=${item.id}`
                  }
                  className={
                    item.product.stock !== null && item.product.stock <= 0
                      ? "cursor-not-allowed pointer-events-none"
                      : ""
                  }
                >
                  <button
                    disabled={
                      loadingItemId === item.id ||
                      (item.product.stock !== null && item.product.stock <= 0)
                    }
                    className={`bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer rounded-xl px-6 py-2 text-sm font-bold h-11 flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.98] ${
                      item.product.stock !== null && item.product.stock <= 0
                        ? "opacity-50 grayscale cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {item.product.stock !== null && item.product.stock <= 0
                      ? "Stok Habis"
                      : "Checkout"}{" "}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
