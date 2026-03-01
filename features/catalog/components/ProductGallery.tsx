"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ProductImage } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  // Extract URLs from the relational images array
  const allImages = images.map((img) => img.url);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    // Sync state when carousel slides
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  const handleThumbnailClick = (idx: number) => {
    setCurrentIndex(idx);
    // Move the main carousel to the chosen thumbnail
    if (api) {
      api.scrollTo(idx);
    }
  };

  if (allImages.length === 0) {
    return (
      <div className="w-full aspect-[4/5] relative bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image Carousel */}
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-full relative group shadow-sm bg-muted rounded-3xl overflow-hidden aspect-[4/3]"
      >
        <CarouselContent className="ml-0">
          {allImages.map((img, idx) => (
            <CarouselItem key={idx} className="pl-0 flex-none w-full">
              <div className="w-full h-full aspect-[4/3] relative">
                <Image
                  src={img}
                  alt={`${productName} - Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={idx === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {allImages.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 border-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 w-12 h-12 bg-background/90 hover:bg-background" />
            <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 border-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 w-12 h-12 bg-background/90 hover:bg-background" />
          </>
        )}
      </Carousel>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex justify-between gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide w-full">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative w-24 aspect-square bg-muted rounded-2xl overflow-hidden shrink-0 snap-start border-2 transition-all ${
                idx === currentIndex
                  ? "border-foreground"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
