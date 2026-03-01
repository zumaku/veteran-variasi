import { getCatalogProducts } from "./get-catalog";

/**
 * Fetches related products from the catalog to recommend to users
 * @param excludeProductId - The product ID to exclude from recommendations
 * @param categorySlug - The category slug to filter recommendations by
 * @param limit - Maximum number of products to return
 * @returns Array of recommended related products
 */
export async function getRelatedProducts(excludeProductId: number, categorySlug?: string, limit: number = 3) {
  const { products: relatedProducts } = await getCatalogProducts({
    category: categorySlug,
    skip: 0,
    take: limit + 1, // Fetch one extra in case the excluded product is within the first results
  });

  return relatedProducts
    .filter((p) => p.id !== excludeProductId)
    .slice(0, limit);
}
