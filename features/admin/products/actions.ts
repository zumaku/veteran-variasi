"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createProductSchema,
  updateProductSchema,
} from "./validations";
import { saveImagesLocal } from "@/lib/upload";
import { unlinkSync } from "fs";
import { join } from "path";

/**
 * Creates a new product
 * @param formData - The form data containing product details
 * @returns Object with result or error
 */
export async function createProductAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description") || null,
      price: formData.get("price"),
      stock: formData.get("stock") ? formData.get("stock") : null,
      categoryIds: formData.getAll("categoryIds"),
    };

    const validatedData = createProductSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validation failed. Please check your inputs.",
      };
    }

    const { name, type, description, price, stock, categoryIds } = validatedData.data;
    const imageFiles = formData.getAll("images") as File[];

    // Generate a simple slug from the name
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });
    
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Save images locally
    const imageUrls = await saveImagesLocal(imageFiles, "products");

    await prisma.product.create({
      data: {
        name,
        slug,
        type,
        description,
        price,
        stock,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        images: {
          create: imageUrls.map((url) => ({ url })),
        },
      },
    });

    revalidatePath("/dashboard/admin/products");
    redirect(`/dashboard/admin/products/${slug}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error creating product:", error);
    return {
      success: false,
      message: "Failed to create product. Please try again later.",
    };
  }
}

/**
 * Updates an existing product
 * @param formData - The form data containing product details
 * @returns Object with result or error
 */
export async function updateProductAction(prevState: any, formData: FormData) {
  try {
    const rawData = {
      id: Number(formData.get("id")),
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description") || null,
      price: formData.get("price"),
      stock: formData.get("stock") ? formData.get("stock") : null,
      categoryIds: formData.getAll("categoryIds"),
    };

    const validatedData = updateProductSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Validation failed. Please check your inputs.",
      };
    }

    const { id, name, type, description, price, stock, categoryIds } = validatedData.data;
    const imageFiles = formData.getAll("images") as File[];
    const removedImages = formData.getAll("removedImages") as string[];

    // Save new images
    const newImageUrls = await saveImagesLocal(imageFiles, "products");

    await prisma.$transaction(async (tx) => {
      // 1. Update basic info
      await tx.product.update({
        where: { id },
        data: {
          name,
          type,
          description,
          price,
          stock,
          categories: {
            set: categoryIds.map((cId) => ({ id: cId })),
          },
        },
      });

      // 2. Remove selected images
      if (removedImages.length > 0) {
        await tx.productImage.deleteMany({
          where: {
            productId: id,
            url: { in: removedImages },
          },
        });

        // Delete physical files
        removedImages.forEach((url) => {
          try {
            const filePath = join(process.cwd(), "public", url);
            unlinkSync(filePath);
          } catch (e) {
            console.error("Failed to delete local file:", url, e);
          }
        });
      }

      // 3. Add new images
      if (newImageUrls.length > 0) {
        await tx.productImage.createMany({
          data: newImageUrls.map((url) => ({
            productId: id,
            url,
          })),
        });
      }
    });

  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product. Please try again later.",
    };
  }

  const updatedProduct = await prisma.product.findUnique({
    where: { id: Number(formData.get("id")) },
    select: { slug: true },
  });

  revalidatePath("/dashboard/admin/products");
  if (updatedProduct) {
    revalidatePath(`/dashboard/admin/products/${updatedProduct.slug}`);
    redirect(`/dashboard/admin/products/${updatedProduct.slug}`);
  } else {
    redirect("/dashboard/admin/products");
  }
}

/**
 * Deletes a product
 * @param id - The ID of the product to delete
 */
export async function deleteProductAction(id: number) {
  try {
    // 1. Get image URLs before they are deleted via Cascade
    const product = await prisma.product.findUnique({
      where: { id },
      select: { images: { select: { url: true } } },
    });

    const imageUrls = product?.images.map((img) => img.url) || [];

    // 2. Delete the product (Cascades will hit images and order items)
    await prisma.product.delete({
      where: { id },
    });

    // 3. Delete physical files from disk
    imageUrls.forEach((url) => {
      try {
        const filePath = join(process.cwd(), "public", url);
        unlinkSync(filePath);
      } catch (e) {
        console.error("Failed to delete local image file during product deletion:", url, e);
      }
    });

    revalidatePath("/dashboard/admin/products");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    
    if (error.code === 'P2003') {
      return { 
        success: false, 
        message: "Gagal menghapus produk karena masih ada pesanan yang menggunakan produk ini. Anda harus menghapus pesanan terkait terlebih dahulu atau hubungi developer untuk merubah mode penghapusan." 
      };
    }
    
    return { success: false, message: "Gagal menghapus produk. Terjadi kesalahan pada server." };
  }
}
