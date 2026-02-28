"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Disable scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Robust scroll lock for all devices including iOS Safari
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={35} height={35} />
          <p className="font-bold font-montserrat hidden sm:block leading-none text-xl md:text-2xl">
            Veteran Variasi
          </p>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#catalog"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="#tentang-kami"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="#faq"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Button variant={"outline"}>Masuk</Button>
          <Button>Daftar</Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background h-screen">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="#catalog"
              className="text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Catalog
            </Link>
            <Link
              href="#tentang-kami"
              className="text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="#faq"
              className="text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Button variant="outline" className="w-full justify-center">
                Masuk
              </Button>
              <Button className="w-full justify-center">Daftar</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
