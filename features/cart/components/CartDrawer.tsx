"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCartIcon, Trash2, Plus, Minus } from "lucide-react";
import { rupiahConverter } from "@/features/catalog/lib";
import { toast } from "@/lib/toast-store";
import {
  updateCartItemQuantityAction,
  removeFromCartAction,
} from "@/features/cart/actions";

// Define local component types to avoid circular dependencies
type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: any;
    images?: { url: string }[];
  };
};

type Cart = {
  id: number;
  items: CartItem[];
};

export function CartDrawer({
  cartData,
  triggerCount = 0,
}: {
  cartData: Cart | null;
  triggerCount: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<number | null>(null);

  // Sync state if cartData changes props (e.g. Server Action revalidates)
  // We'll manage the state optimistically where possible
  const cartItems = cartData?.items || [];
  const itemCount = triggerCount > 0 ? triggerCount : cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const calculateTotal = () => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return handleRemove(itemId);
    
    setIsLoading(itemId);
    const result = await updateCartItemQuantityAction(itemId, newQuantity);
    if (!result.success) {
      toast.error(result.error || "Gagal mengupdate kuantitas");
    }
    setIsLoading(null);
  };

  const handleRemove = async (itemId: number) => {
    setIsLoading(itemId);
    const result = await removeFromCartAction(itemId);
    if (!result.success) {
      toast.error(result.error || "Gagal menghapus item");
    } else {
      toast.success("Item berhasil dihapus dari keranjang");
    }
    setIsLoading(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative cursor-pointer">
          <ShoppingCartIcon className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl font-black font-montserrat flex items-center gap-2">
            <ShoppingCartIcon className="w-6 h-6" /> Keranjang Belanja
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground pb-20">
              <ShoppingCartIcon className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">Keranjang masih kosong</p>
              <p className="text-sm mt-1 mb-6 text-center px-6">
                Temukan layanan dan produk terbaik untuk kendaraan Anda.
              </p>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Lanjut Belanja
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-muted/30 rounded-lg border relative"
                >
                  {isLoading === item.id && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
                      <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.product.images?.[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        No IMG
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/catalog/${item.product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="font-semibold line-clamp-1 hover:text-primary transition-colors pr-6"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-medium text-primary mt-1">
                        {rupiahConverter(Number(item.product.price))}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md h-8 bg-background">
                        <button
                          className="w-8 h-full flex items-center justify-center hover:bg-muted text-foreground transition-colors cursor-pointer"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading === item.id}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="w-8 h-full flex items-center justify-center text-sm font-medium border-x">
                          {item.quantity}
                        </div>
                        <button
                          className="w-8 h-full flex items-center justify-center hover:bg-muted text-foreground transition-colors cursor-pointer"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading === item.id}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-destructive hover:text-destructive/80 p-1.5 bg-destructive/10 hover:bg-destructive/20 rounded-md transition-colors cursor-pointer"
                        title="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4 pb-2 mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-foreground">Total Keseluruhan</span>
              <span className="text-xl font-bold font-montserrat text-primary">
                {rupiahConverter(calculateTotal())}
              </span>
            </div>
            {/* Proceed to checkout (placeholder link for now) */}
            <Link href="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full cursor-pointer h-12 text-lg">
                Proses Pesanan
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
