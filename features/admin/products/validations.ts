import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  slug: z.string().max(255).optional(),
  type: z.enum(["ACCESSORY", "SERVICE"], {
    message: "Please select a product type",
  }),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.coerce.number().int().min(0, "Stock must be greater than or equal to 0").nullable().optional(),
  categoryIds: z.array(z.coerce.number().int()).min(1, "Minimal 1 kategori harus dipilih"),
});

export const updateProductSchema = z.object({
  id: z.number().int(),
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  slug: z.string().max(255).optional(),
  type: z.enum(["ACCESSORY", "SERVICE"], {
    message: "Please select a product type",
  }),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.coerce.number().int().min(0, "Stock must be greater than or equal to 0").nullable().optional(),
  categoryIds: z.array(z.coerce.number().int()).min(1, "Minimal 1 kategori harus dipilih"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
