"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { carSchema } from "./validations";
import { saveImagesLocal } from "@/lib/upload";
import { unlinkSync } from "fs";
import { join } from "path";

export async function createCarAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      userId: Number(formData.get("userId")),
      brand: formData.get("brand"),
      model: formData.get("model"),
      year: formData.get("year"),
      licensePlate: formData.get("licensePlate"),
    };

    const validatedData = carSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Lengkapi data dengan benar.",
      };
    }

    const { userId, brand, model, year, licensePlate } = validatedData.data;
    
    // Generate slug: brand-model-licensePlate
    let slug = `${brand}-${model}-${licensePlate}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug exists
    const existingSlug = await prisma.car.findUnique({
      where: { slug },
    });
    
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const urls = await saveImagesLocal([imageFile], "cars");
      if (urls.length > 0) {
        imageUrl = urls[0];
      }
    }

    await prisma.car.create({
      data: {
        userId,
        brand,
        model,
        year,
        licensePlate,
        slug,
        image: imageUrl,
      },
    });

    revalidatePath("/dashboard/user/profile");
    return { success: true, message: "Mobil berhasil ditambahkan." };
  } catch (error) {
    console.error("Error creating car:", error);
    return {
      success: false,
      message: "Gagal menambahkan mobil. Silakan coba lagi.",
    };
  }
}

export async function updateCarAction(prevState: any, formData: FormData) {
  try {
    const id = Number(formData.get("id"));
    const rawData = {
      userId: Number(formData.get("userId")),
      brand: formData.get("brand"),
      model: formData.get("model"),
      year: formData.get("year"),
      licensePlate: formData.get("licensePlate"),
    };

    const validatedData = carSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Lengkapi data dengan benar.",
      };
    }

    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      return { success: false, message: "Mobil tidak ditemukan." };
    }

    const { brand, model, year, licensePlate } = validatedData.data;
    const updateData: any = { brand, model, year, licensePlate };

    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      const urls = await saveImagesLocal([imageFile], "cars");
      if (urls.length > 0) {
        updateData.image = urls[0];
        
        // Remove old image
        if (car.image) {
          try {
            const oldPath = join(process.cwd(), "public", car.image);
            unlinkSync(oldPath);
          } catch (e) {
            console.error("Failed to delete old car image:", e);
          }
        }
      }
    }

    await prisma.car.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/dashboard/user/profile");
    return { success: true, message: "Mobil berhasil diperbarui." };
  } catch (error) {
    console.error("Error updating car:", error);
    return {
      success: false,
      message: "Gagal memperbarui mobil. Silakan coba lagi.",
    };
  }
}

export async function deleteCarAction(id: number) {
  try {
    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      return { success: false, message: "Mobil tidak ditemukan." };
    }

    if (car.image) {
      try {
        const filePath = join(process.cwd(), "public", car.image);
        unlinkSync(filePath);
      } catch (e) {
        console.error("Failed to delete car image:", e);
      }
    }

    await prisma.car.delete({
      where: { id },
    });

    revalidatePath("/dashboard/user/profile");
    return { success: true, message: "Mobil berhasil dihapus." };
  } catch (error) {
    console.error("Error deleting car:", error);
    return {
      success: false,
      message: "Gagal menghapus mobil. Silakan coba lagi.",
    };
  }
}
