import { prisma } from "@/lib/prisma";

/**
 * Retrieves the top 3 best-selling products to feature on the homepage
 * This automatically fetches products with the most order items.
 * @returns Array of the featured products
 */
export default async function getTopFourProduct() {
  const topProducts = await prisma.product.findMany({
    take: 4,
    orderBy: {
      orderItems: {
        _count: 'desc',
      },
    },
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
    }
  });

  return topProducts;
}