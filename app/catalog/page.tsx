import {
  getCatalogCategories,
  getCatalogProducts,
} from "@/features/catalog/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import CatalogFilters from "@/features/catalog/components/CatalogFilters";
import CatalogPagination from "@/features/catalog/components/CatalogPagination";

interface CatalogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Main catalog page server component
 * @param props.searchParams - The URL search parameters for filtering and pagination (Next.js 15+ async searchParams)
 * @returns The rendered catalog page with filters, products list, and pagination
 */
export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const page = typeof params.page === "string" ? Number(params.page) : 1;
  const take = 12;
  const skip = (page - 1) * take;

  const [categories, { products, totalProducts }] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts({ q, category, skip, take }),
  ]);

  const totalPages = Math.ceil(totalProducts / take);

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      {/* Header Section */}
      <div className="text-center w-full max-w-3xl mx-auto mb-12">
        <div className="w-24 h-2 bg-primary mx-auto mb-6 rounded-full" />
        <h1 className="text-4xl md:text-5xl font-black font-montserrat tracking-tight mb-4 text-foreground">
          Katalog Produk & Layanan
        </h1>
        <p className="text-muted-foreground text-lg">
          Temukan berbagai perlengkapan, aksesori, dan layanan terbaik untuk
          kendaraan Anda.
        </p>
      </div>

      <CatalogFilters categories={categories} />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">
            Tidak ada layanan atau produk yang ditemukan.
          </p>
        </div>
      )}

      <CatalogPagination totalPages={totalPages} />
    </div>
  );
}
