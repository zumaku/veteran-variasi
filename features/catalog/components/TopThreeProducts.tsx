import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import getTopThreeProduct from "../data/get-top-three-product";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TopThreeProducts() {
  const topProducts = await getTopThreeProduct();

  return (
    <section id="catalog" className="bg-muted/50 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
          Layanan Unggulan Kami
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Kami menyediakan berbagai layanan perawatan dan modifikasi untuk
          memastikan performa dan tampilan mobil Anda selalu optimal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          {/* <Link href="/catalog" className="flex items-center gap-2 text-primary-foreground font-semibold hover:text-primary-foreground-hover transition-colors">
            Lihat Layanan Lainnya
            <ChevronRight className="w-4 h-4" />
          </Link> */}
          <Button variant="link" asChild>
            <Link href="/catalog">
              Lihat Layanan Lainnya
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
