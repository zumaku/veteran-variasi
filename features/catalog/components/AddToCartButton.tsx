"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon, Loader2 } from "lucide-react";
import { addToCartAction } from "@/features/cart/actions";
import { toast } from "@/lib/toast-store";
import { useRouter } from "next/navigation";

export default function AddToCartButton({
  productId,
  children,
  className,
}: {
  productId: number;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if this is inside a link
    setIsLoading(true);
    
    try {
      const result = await addToCartAction(productId, 1);
      
      if (result.success) {
        toast.success(result.message || "Berhasil ditambahkan ke keranjang");
        router.refresh(); // Refresh to update cart count in navbar
      } else {
        toast.error(result.error || "Gagal menambahkan produk");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      className={`cursor-pointer ${className}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCartIcon className="w-4 h-4 mr-2" />
      )}
      {children || "Add"}
    </Button>
  );
}
