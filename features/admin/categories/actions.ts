"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { createCategorySchema, updateCategorySchema } from "./validations";

export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

async function verifyAdmin() {
  const session = await getSession();
  if (!session) return false;

  const user = await prisma.user.findUnique({
    where: { id: (session as any).userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}

export async function createCategoryAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || null,
  };

  const validatedData = createCategorySchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const { name, description } = validatedData.data;
    const slug = generateSlug(name);

    // Check if slug exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, message: "Kategori dengan nama ini sudah ada." };
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, message: "Gagal membuat kategori" };
  }
}

export async function updateCategoryAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    id: parseInt(formData.get("id")?.toString() || "0", 10),
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || null,
  };

  const validatedData = updateCategorySchema.safeParse(rawData);

  if (!validatedData.success) {
    return {
      success: false,
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, name, description } = validatedData.data;
    const slug = generateSlug(name);

    // Check if new slug exists on different category
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing && existing.id !== id) {
      return { success: false, message: "Kategori dengan nama ini sudah ada." };
    }

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, message: "Gagal memperbarui kategori" };
  }
}

export async function deleteCategoryAction(id: number): Promise<ActionResponse> {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, message: "Gagal menghapus kategori. Kategori mungkin sedang digunakan oleh produk." };
  }
}
