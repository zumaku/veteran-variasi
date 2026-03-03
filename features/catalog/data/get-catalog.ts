import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Retrieves all categories for the catalog filters
 * @returns Array of categories
 */
export async function getCatalogCategories() {
  return await prisma.category.findMany();
}

/**
 * Retrieves products based on search query, category, and pagination parameters
 * @param params.q - Optional search query string
 * @param params.category - Optional category slug
 * @param params.skip - Number of records to skip
 * @param params.take - Number of records to take
 * @returns Object containing the products and the total count of matched products
 */
export async function getCatalogProducts({
  q,
  category,
  skip,
  take,
}: {
  q?: string;
  category?: string;
  skip: number;
  take: number;
}) {
  const where: Prisma.ProductWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, } },
      { description: { contains: q } },
    ];
  }

  if (category) {
    where.categories = {
      some: {
        slug: category,
      },
    };
  }

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { id: "desc" },
      include: {
        images: true,
        orderItems: {
          include: {
            order: {
              include: {
                review: true,
              },
            },
          },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, totalProducts };
}
