import { prisma } from "@/lib/prisma";

/**
 * Retrieves a single product by its slug, including associated reviews through order items
 * @param slug - The unique slug of the product
 * @returns The product with related reviews or null if not found
 */
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: {
      images: true,
      categories: true,
      orderItems: {
        include: {
          order: {
            include: {
              review: true,
              user: true,
            }
          }
        }
      }
    }
  });

  return product;
}
