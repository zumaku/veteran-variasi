import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConditionalLayout from "@/components/ConditionalLayout";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

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

  if (session?.userId) {
    user = await prisma.user.findUnique({
      where: { id: session.userId as number },
      select: { name: true, role: true },
    });
  }

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${inter.variable} font-inter antialiased`}
      >
        <ConditionalLayout 
          navbar={<Navbar user={user} />}
          footer={<Footer />}
        >
          <main>{children}</main>
        </ConditionalLayout>
      </body>
    </html>
  );
}
