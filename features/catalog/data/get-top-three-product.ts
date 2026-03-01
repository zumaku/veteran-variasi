import { prisma } from "@/lib/prisma";

/**
 * Retrieves specific curated products to feature on the homepage
 * This exists to allow store owners to manually curate promoted items (e.g. highest margin or best sellers)
 * directly through the CMS settings instead of automatically fetching the newest products
 * @returns Array of the featured products
 */
export default async function getTopThreeProduct() {
  const setting = await prisma.setting.findFirst();

  // Parse topProducts as number[] or default to empty array
  const topProductIds = (setting?.topProducts as number[]) || [];

  const topProducts = await prisma.product.findMany({
    where: {
      id: {
        in: topProductIds,
      },
    },
  });

  return topProducts;
}