import { Product } from "@prisma/client";
import Image from "next/image";
import { rupiahConverter } from "../lib/rupiah-converter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Displays a single product summary in a card layout to attract customers
 * @param props.product - The product data to display
 * @returns The rendered product card component
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow group flex flex-col items-center">
      {/* Container requires relative positioning and overflow hidden for next/image fill property to respect boundaries during hover scaling */}
      <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
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
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold font-montserrat text-foreground">
            {rupiahConverter(product.price.toNumber())}
          </span>
          <Button>
            <Link href={`/catalog/${product.slug}`}>
              Pesan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
