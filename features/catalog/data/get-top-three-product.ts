import { prisma } from "@/lib/prisma";

/**
 * Retrieves the top 3 best-selling products to feature on the homepage
 * This automatically fetches products with the most order items.
 * @returns Array of the featured products
 */
export default async function getTopThreeProduct() {
  const topProducts = await prisma.product.findMany({
    take: 3,
    orderBy: {
      orderItems: {
        _count: 'desc',
      },
    },
  });

  return topProducts;
}