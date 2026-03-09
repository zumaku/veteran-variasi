import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  slug: z.string().max(100).optional(),
  description: z.string().nullable().optional(),
});

export const updateCategorySchema = z.object({
  id: z.number().int(),
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  slug: z.string().max(100).optional(),
  description: z.string().nullable().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
