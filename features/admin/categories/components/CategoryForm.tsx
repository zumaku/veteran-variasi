"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  createCategorySchema,
  updateCategorySchema,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validations";
import { createCategoryAction, updateCategoryAction } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast-store";

interface CategoryFormProps {
  initialData?: Category | null;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialData;
  const schema = isEditing ? updateCategorySchema : createCategorySchema;

  const form = useForm<CreateCategoryInput | UpdateCategoryInput>({
    resolver: zodResolver(schema as any),
    defaultValues: initialData
      ? {
          id: initialData.id,
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description,
        }
      : {
          name: "",
          description: "",
        },
  });

  const onSubmit = (values: any) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined) {
          formData.append(key, values[key].toString());
        }
      });

      const result = isEditing
        ? await updateCategoryAction(null, formData)
        : await createCategoryAction(null, formData);

      if (result && !result.success) {
        if (result.errors) {
          Object.keys(result.errors).forEach((key) => {
            form.setError(key as any, {
              type: "server",
              message: (result.errors as Record<string, string[]>)[key]?.[0],
            });
          });
        }
        if (result.message) {
          toast.error(result.message);
        }
      } else {
        toast.success(result?.message || "Kategori berhasil disimpan");
        router.push("/dashboard/admin/categories");
        router.refresh();
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
              <FormLabel>Nama Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Kaca Film" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Deskripsi kategori..."
                  className="resize-none min-h-[120px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Kategori"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
