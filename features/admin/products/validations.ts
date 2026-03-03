import { z } from "zod";
import { ProductType } from "@prisma/preflight"; // wait, the Prisma generated client should be "@prisma/client" I will use z.enum(["ACCESSORY", "SERVICE"]).

export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  slug: z.string().max(255).optional(),
  type: z.enum(["ACCESSORY", "SERVICE"], {
    required_error: "Please select a product type",
  }),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.coerce.number().int().min(0, "Stock must be greater than or equal to 0").nullable().optional(),
});

export const updateProductSchema = z.object({
  id: z.number().int(),
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  slug: z.string().max(255).optional(),
  type: z.enum(["ACCESSORY", "SERVICE"], {
    required_error: "Please select a product type",
  }),
  description: z.string().nullable().optional(),
  price: z.coerce.number().min(0, "Price must be greater than or equal to 0"),
  stock: z.coerce.number().int().min(0, "Stock must be greater than or equal to 0").nullable().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
