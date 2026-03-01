"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const handleAddToCart = () => {
    // TODO: Add to cart
    console.log("Add to cart", productId);
  };

  return (
    <Button onClick={handleAddToCart} className="cursor-pointer">
      <ShoppingCartIcon className="w-4 h-4" />
    </Button>
  );
}