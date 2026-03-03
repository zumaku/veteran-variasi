"use client";

import { useTransition } from "react";
import { Product } from "@prisma/client";
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
import { deleteProductAction } from "../actions";

type SerializedProduct = Omit<Product, "price"> & { price: number };

interface DeleteProductDialogProps {
  product: SerializedProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog to confirm deletion of a product.
 * @param product - the Product to delete
 * @param open - true if the dialog is visible
 * @param onOpenChange - callback to update visibility state
 * @returns Dialog JSX component
 */
export function DeleteProductDialog({
  product,
  open,
  onOpenChange,
}: DeleteProductDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!product) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (result.success) {
        onOpenChange(false);
      } else {
        alert(result.message || "Gagal menghapus produk");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan secara permanen
            menghapus produk{" "}
            <span className="font-semibold">{product.name}</span> dari database
            kami.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
