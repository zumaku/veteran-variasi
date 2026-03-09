import { Prisma, Review } from "@prisma/client";
import Image from "next/image";
import { rupiahConverter, calculateRatingStats } from "@/features/catalog/lib";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true;
    orderItems: {
      include: {
        order: {
          include: {
            review: true;
          };
        };
      };
    };
  };
}>;

/**
 * Displays a single product summary in a card layout to attract customers
 * @param props.product - The product data to display
 * @returns The rendered product card component
 */
export default function ProductCard({
  product,
}: {
  product: ProductWithImages;
}) {
  const primaryImageUrl = product.images?.[0]?.url || null;

  const reviews: Review[] = product.orderItems
    .flatMap((item) => item.order.review)
    .filter((review): review is Review => review !== null);

  const ratingStats = calculateRatingStats(reviews);

  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow group flex flex-col items-center">
      <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden">
        {primaryImageUrl ? (
          <Image
            src={primaryImageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <span className="text-sm">No image available</span>
          </div>
        )}
      </div>
      <div className="p-6 text-left w-full">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(ratingStats.average)
                  ? "fill-primary text-primary"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            {ratingStats.average > 0 ? ratingStats.average.toFixed(1) : 0} (
            {ratingStats.total})
          </span>
        </div>
        <Link href={`/catalog/${product.slug}`}>
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold font-montserrat text-foreground">
            {rupiahConverter(product.price.toNumber())}
          </span>
          <div className="flex gap-2">
            {/* <Link href={`/catalog/${product.slug}`}>
              <Button variant="outline" className="cursor-pointer">
                Detail
              </Button>
            </Link> */}
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
