import { Review } from "@prisma/client";

/**
 * Calculates rating statistics, such as average and distribution, from an array of reviews.
 * @param reviews - The reviews to calculate stats for
 * @returns Rating statistics including average, total, and distribution map
 */
export function calculateRatingStats(reviews: Review[]) {
  const total = reviews.length;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  if (total === 0) {
    return { average: 0, total: 0, distribution };
  }

  let sum = 0;
  reviews.forEach((review) => {
    const r = Math.min(Math.max(review.rating, 1), 5) as 1 | 2 | 3 | 4 | 5;
    distribution[r]++;
    sum += r;
  });

  return {
    average: sum / total,
    total,
    distribution,
  };
}
