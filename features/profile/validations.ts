import { z } from "zod";

export const updateProfileSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export const updatePasswordSchema = z.object({
  userId: z.number(),
  currentPassword: z.string().min(1, "Password saat ini diperlukan"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});
