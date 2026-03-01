"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

/**
 * Renders pagination controls for the catalog page based on total pages
 * @param props.totalPages - The total number of pages available
 * @returns The rendered pagination component or null if only one page exists
 */
export default function CatalogPagination({
  totalPages,
}: {
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Logic to show ellipsis if too many pages
  const generatePaginationNumbers = () => {
    // If total pages is 7 or less, display all pages without ellipsis.
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
      return [1, 2, 3, "...", totalPages - 1, totalPages];
    }

    // If current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    // If current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = generatePaginationNumbers();

  return (
    <Pagination className="mt-12 mb-8">
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          ) : (
            <span className="cursor-not-allowed opacity-50 px-2.5 py-2 inline-flex items-center gap-1">
              &lt; Sebelumnya
            </span>
          )}
        </PaginationItem>

        {pages.map((page, i) => (
          <PaginationItem key={i}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext href={createPageURL(currentPage + 1)} />
          ) : (
            <span className="cursor-not-allowed opacity-50 px-2.5 py-2 inline-flex items-center gap-1">
              Berikutnya &gt;
            </span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
