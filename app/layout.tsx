import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConditionalLayout from "@/components/ConditionalLayout";
import { Toaster } from "@/components/ui/custom-toaster";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart } from "@/features/cart/actions";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veteran Variasi",
  description: "Rawat Mobil Anda Tanpa Antri Lama",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  let user = null;
  let cartData = null;

  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { name: true, role: true },
    });
    // get user cart
    cartData = await getOrCreateCart();
  }

  // Need to pass simple generic object to Navbar to avoid complex Prisma types in client side
  const serializedCart = cartData ? {
    id: cartData.id,
    items: cartData.items.map((item: any) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price.toNumber ? item.product.price.toNumber() : Number(item.product.price),
        images: item.product.images.map((img: any) => ({ url: img.url }))
      }
    }))
  } : null;

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} font-inter antialiased`}
      >
        <ConditionalLayout 
          navbar={<Navbar user={user} cartData={serializedCart} />}
          footer={<Footer />}
        >
          <main>{children}</main>
        </ConditionalLayout>
        <Toaster />
      </body>
    </html>
  );
}
