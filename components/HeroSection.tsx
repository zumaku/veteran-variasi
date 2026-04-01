"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Box } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function HeroSection() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    const imageSrc =
      theme === "dark"
        ? "/hero-dark.png"
        : "/hero-light.png";

    return (
        <section className="px-4 h-fit md:h-fit flex flex-col justify-between md:justify-center items-center w-full max-w-[100vw] overflow-x-hidden">
        <div className="flex flex-col items-center gap-4">
          <h1 className="pt-12 md:pt-20 text-center text-3xl sm:text-4xl lg:text-6xl font-bold font-semakin uppercase leading-[1.2] md:leading-[1.1] tracking-tight text-foreground max-w-4xl">
            Aksesoris Modern Untuk <br className="hidden sm:block" /> Performa
            Berkendara
          </h1>

          <Link href="/catalog">
            <Button variant="dark" size="xl" className="mt-4 rounded-full px-8 cursor-pointer">
              <Box className="w-5 h-5" />
              Lihat Koleksi
            </Button>
          </Link>
        </div>

        <div className="md:w-full w-xl max-w-5xl mt-32 md:mt-8 md:mt-14 px-2 sm:px-0">
          <Image
            src={imageSrc}
            alt="Koleksi Aksesoris Mobil Premium"
            width={1000}
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </section>
    )
}