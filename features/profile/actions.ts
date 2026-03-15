"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateProfileSchema, updatePasswordSchema } from "./validations";
import { saveImagesLocal } from "@/lib/upload";
import { compare, hash } from "bcryptjs";
import { unlinkSync } from "fs";
import { join } from "path";

export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      id: Number(formData.get("id")),
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      address: formData.get("address") || null,
    };

    const validatedData = updateProfileSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Lengkapi data dengan benar.",
      };
    }

    const { id, name, email, phone, address } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return { success: false, message: "User tidak ditemukan." };
    }

    const updateData: any = { name, email, phone, address };

    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      // Save new image
      const imageUrls = await saveImagesLocal([imageFile], "profiles");
      if (imageUrls.length > 0) {
        updateData.image_url = imageUrls[0];
        
        // Remove old image if exists
        if (user.image_url) {
          try {
            const oldPath = join(process.cwd(), "public", user.image_url);
            unlinkSync(oldPath);
          } catch (e) {
            console.error("Failed to delete old profile image:", e);
          }
        }
      }
    }

    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/profile");
    return { success: true, message: "Profil berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: "Gagal memperbarui profil. Silakan coba lagi.",
    };
  }
}

export async function updatePasswordAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      userId: Number(formData.get("userId")),
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validatedData = updatePasswordSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Konfirmasi password harus sama.",
      };
    }

    const { userId, currentPassword, newPassword } = validatedData.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: "User tidak ditemukan." };
    }

    const isMatch = await compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return {
        success: false,
        errors: { currentPassword: ["Password saat ini salah"] },
        message: "Password saat ini salah.",
      };
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });

    return { success: true, message: "Password berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: "Gagal memperbarui password. Silakan coba lagi.",
    };
  }
}
