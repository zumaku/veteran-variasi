"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Menu, Search, X, ShoppingCartIcon } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Logo from "./Logo";

export default function Navbar({
  user,
  cartData,
}: {
  user?: { name: string; role: string } | null;
  cartData?: any;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("q") as string;

    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-primary" size={32} />
          <p className="font-bold font-montserrat hidden sm:block leading-none text-xl md:text-2xl">
            Veteran Variasi
          </p>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/catalog"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Katalog
          </Link>
          <Link
            href="/#tentang-kami"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            Tentang Kami
          </Link>
          <Link
            href="/#faq"
            className="text-foreground/80 hover:text-primary transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="text-muted-foreground hover:text-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cari Produk</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  name="q"
                  placeholder="Ketik kata kunci..."
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit">Cari</Button>
              </form>
            </DialogContent>
          </Dialog>
          {user && (
            <Link href="/dashboard/user/cart" className="relative cursor-pointer flex items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors mr-2">
              <ShoppingCartIcon className="h-[22px] w-[22px]" />
              {cartData?.items?.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-background text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center transform translate-x-1/4 -translate-y-1/4 border border-background">
                  {cartData.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => {
                  if (isMobileMenuOpen) setIsMobileMenuOpen(false);
                }}
              >
                <Button className="cursor-pointer">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/login">
                <Button variant={"outline"} className="cursor-pointer">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="cursor-pointer">Daftar</Button>
              </Link>
            </div>
          )}
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
              Katalog
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
              <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 px-4"
                  >
                    <Search className="h-5 w-5" />
                    Cari Produk
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90vw] rounded-lg sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cari Produk</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      name="q"
                      placeholder="Ketik kata kunci..."
                      className="flex-1"
                      autoFocus
                    />
                    <Button type="submit">Cari</Button>
                  </form>
                </DialogContent>
              </Dialog>
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/profile" passHref>
                    <Button
                      variant="ghost"
                      className="w-full justify-center font-medium cursor-pointer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard ({user.name})
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant="outline"
                      className="w-full justify-center cursor-pointer"
                    >
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full justify-center cursor-pointer">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
              <div className="pt-2 flex items-center justify-between border-t px-1">
                <span className="text-sm font-medium">Auto Theme Mode</span>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
