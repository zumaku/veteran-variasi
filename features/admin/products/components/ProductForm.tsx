"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createProductSchema,
  updateProductSchema,
  CreateProductInput,
  UpdateProductInput,
} from "../validations";
import { createProductAction, updateProductAction } from "../actions";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./ImageUpload";

type SerializedProduct = Omit<Product, "price"> & {
  price: number;
  images?: { id: number; url: string }[];
};

interface ProductFormProps {
  initialData?: SerializedProduct | null;
}

/**
 * Form for creating or editing a product.
 * @param initialData - Existing product data if editing
 * @returns Form component
 */
export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialData;
  const schema = isEditing ? updateProductSchema : createProductSchema;

  const form = useForm<CreateProductInput | UpdateProductInput>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData
      ? {
          id: initialData.id,
          name: initialData.name,
          slug: initialData.slug,
          type: initialData.type,
          description: initialData.description,
          price: initialData.price,
          stock: initialData.stock,
        }
      : {
          name: "",
          type: "ACCESSORY",
          description: "",
          price: 0,
          stock: 0,
        },
  });

  const [images, setImages] = React.useState<
    (File | { url: string; id?: number })[]
  >(initialData?.images || []);
  const [removedImages, setRemovedImages] = React.useState<string[]>([]);

  const handleRemoveImage = (url: string) => {
    setRemovedImages((prev) => [...prev, url]);
  };

  const hasOversizedImage = images.some(
    (img) => img instanceof File && img.size > 1 * 1024 * 1024,
  );

  const onSubmit = (values: any) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key].toString());
        }
      });

      // Append new files
      images.forEach((img) => {
        if (img instanceof File) {
          formData.append("images", img);
        }
      });

      // Append removed image URLs (for editing)
      removedImages.forEach((url) => {
        formData.append("removedImages", url);
      });

      const result = isEditing
        ? await updateProductAction(null, formData)
        : await createProductAction(null, formData);

      if (result && !result.success) {
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            form.setError(key as any, {
              type: "server",
              message: (result.errors as Record<string, string[]>)[key]?.[0],
            });
          });
        }
        alert(result.message || "An error occurred");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control as any}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Kaca Film 3M" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe produk" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACCESSORY">Aksesoris</SelectItem>
                  <SelectItem value="SERVICE">Layanan</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control as any}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok (Opsional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Kosongkan jika tidak ada batasan stok
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control as any}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi lengkap produk..."
                  className="resize-none min-h-[120px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="mb-2 block">Foto Produk (Opsional)</FormLabel>
          <ImageUpload
            value={images}
            onChange={setImages}
            onRemove={handleRemoveImage}
          />
          {hasOversizedImage && (
            <p className="text-sm font-medium text-destructive mt-2">
              Terdapat foto yang ukurannya melebihi batas 1MB. Silakan kurangi
              ukuran foto tersebut.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending || hasOversizedImage}>
            {isPending ? "Menyimpan..." : "Simpan Produk"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
