import { prisma } from "@/lib/prisma";

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