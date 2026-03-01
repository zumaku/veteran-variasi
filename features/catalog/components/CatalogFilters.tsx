"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CatalogFiltersProps {
  categories: Category[];
}

/**
 * Filter component for the catalog page, managing search queries and category selection
 * Updates URL search params for server-side processing
 */
export default function CatalogFilters({ categories }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("q") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page when filters change
      params.delete("page");
      return params.toString();
    },
    [searchParams],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      router.replace(`${pathname}?${createQueryString("q", e.target.value)}`);
    });
  };

  const handleCategoryClick = (categorySlug: string) => {
    startTransition(() => {
      if (currentCategory === categorySlug) {
        // Toggle off if already selected
        router.replace(`${pathname}?${createQueryString("category", "")}`);
      } else {
        router.replace(
          `${pathname}?${createQueryString("category", categorySlug)}`,
        );
      }
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-10 flex flex-col items-center gap-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Cari layanan, aksesori..."
          className="pl-10 py-6 text-base rounded-full bg-background border-border/50 shadow-sm"
          defaultValue={currentSearch}
          onChange={(e) => {
            // Debounce could be added here if needed, but simple transistion is fine for small apps
            handleSearchChange(e);
          }}
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => handleCategoryClick("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === ""
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Semua Kategori
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
