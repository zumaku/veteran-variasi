import { notFound } from "next/navigation";
import { getProductBySlug } from "@/features/catalog/data/get-product";
import { getCatalogProducts } from "@/features/catalog/data";
import { rupiahConverter } from "@/features/catalog/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductRatingChart from "@/features/catalog/components/ProductRatingChart";
import AddToCartButton from "@/features/catalog/components/AddToCartButton";
import ProductGallery from "@/features/catalog/components/ProductGallery";
import ProductCard from "@/features/catalog/components/ProductCard";
import { Review } from "@prisma/client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

function calculateRatingStats(reviews: Review[]) {
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

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const reviews: Review[] = product.orderItems
    .flatMap((item) => item.order.review)
    .filter((review): review is Review => review !== null);

  const ratingStats = calculateRatingStats(reviews);
  const primaryCategory = product.categories[0]?.name || "Uncategorized";
  const primaryCategorySlug = product.categories[0]?.slug;

  const { products: relatedProducts } = await getCatalogProducts({
    category: primaryCategorySlug,
    skip: 0,
    take: 3,
  });

  // Filter out the current product from related items
  const filteredRelated = relatedProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Top Breadcrumbs */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/catalog">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalog">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/catalog?category=${product.categories[0]?.slug || ""}`}
              >
                {primaryCategory}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="w-full">
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col text-left">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {product.name}
            </h1>
            {/* Tag/Badge for product type or discount, mimicking the mockup */}
            <span className="shrink-0 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold uppercase tracking-wider">
              {product.type === "SERVICE" ? "SERVICE" : "NEW"}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6 text-sm">
            <div className="flex text-[#FFB800]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(ratingStats.average)
                      ? "fill-current"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold">{ratingStats.average.toFixed(1)}</span>
            <span className="text-muted-foreground">
              ({ratingStats.total} Review{ratingStats.total !== 1 ? "s" : ""})
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {rupiahConverter(product.price.toNumber())}
            </span>
            {/* Example struck-through original price for effect, like wireframe */}
            {product.type === "ACCESSORY" && (
              <span className="text-xl text-muted-foreground line-through decoration-1">
                {rupiahConverter(product.price.toNumber() * 1.2)}
              </span>
            )}
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            {product.description || "No description provided."}
          </p>

          <div className="flex items-center gap-4 mb-8 pt-6 border-t border-border">
            <AddToCartButton productId={product.id} />
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-10 pt-6 border-t border-border">
            <p>
              <strong className="text-foreground mr-1">Item Code:</strong>
              {product.id.toString().padStart(8, "0")}
            </p>
            <p>
              <strong className="text-foreground mr-1">Tags:</strong>
              {product.categories.map((c) => c.name).join(", ")}
            </p>
          </div>

          <div className="w-full">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-transparent h-12 p-0 gap-6 w-full justify-start border-b border-border/40 pb-px mb-6">
                <TabsTrigger
                  value="description"
                  className="text-base font-semibold px-4 pb-3 pt-2 rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground transition-all"
                >
                  Product Description
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-base font-semibold px-4 pb-3 pt-2 rounded-full data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground transition-all"
                >
                  Customer Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="description"
                className="min-h-[150px] animate-in fade-in-50 duration-500"
              >
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {product.description ? (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No detailed description available.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="reviews"
                className="min-h-[150px] animate-in fade-in-50 duration-500 outline-none"
              >
                <div className="w-full pt-4 pb-12">
                  <ProductRatingChart stats={ratingStats} />

                  {reviews.length > 0 && (
                    <div className="mt-12 pt-8 border-t">
                      <h3 className="text-xl font-bold mb-6">
                        Ulasan Pelanggan
                      </h3>
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-4 bg-muted/30 rounded-2xl"
                          >
                            <div className="flex text-[#FFB800] mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "fill-current"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-foreground leading-relaxed">
                              {review.comment || "Tanpa komentar"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {filteredRelated.length > 0 && (
        <div className="mt-24 pt-12 border-t border-border/40">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-montserrat font-black text-foreground">
              Explore{" "}
              <span className="text-primary opacity-80">Related Products</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRelated.map((relatedProd) => (
              <ProductCard key={relatedProd.id} product={relatedProd} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
