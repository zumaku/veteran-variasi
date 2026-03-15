import { z } from "zod";

export const carSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  brand: z.string().min(1, "Brand mobil harus diisi"),
  model: z.string().min(1, "Model mobil harus diisi"),
  year: z.number().min(1900, "Tahun tidak valid").max(new Date().getFullYear() + 1, "Tahun tidak valid"),
  licensePlate: z.string().min(1, "Nomor plat harus diisi"),
  image: z.string().optional().nullable(),
});

export type CarInput = z.infer<typeof carSchema>;
