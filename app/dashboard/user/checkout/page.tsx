import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import CheckoutClient from '../../../../features/checkout/components/CheckoutClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getSession();
  if (!session || !session.userId) {
    redirect('/auth/login');
  }

  const resolvedSearchParams = await searchParams;
  const itemId = resolvedSearchParams.item;
  if (!itemId) {
    redirect('/dashboard/user/cart');
  }

  // Fetch the cart item
  const cartItem = await prisma.cartItem.findUnique({
    where: { 
      id: parseInt(itemId),
      cart: {
        userId: session.userId as number
      }
    },
    include: {
      product: {
        include: {
          images: true
        }
      }
    }
  });

  if (!cartItem) {
    redirect('/dashboard/user/cart');
  }

  // Fetch User's Cars
  const cars = await prisma.car.findMany({
    where: { userId: session.userId as number },
    orderBy: { createdAt: 'desc' }
  });

  // Next.js props serialization needs numbers instead of Decimal
  const serializedItem = {
    ...cartItem,
    product: {
      ...cartItem.product,
      price: cartItem.product.price.toNumber ? cartItem.product.price.toNumber() : Number(cartItem.product.price)
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard/user/cart" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Keranjang
        </Link>
        <h1 className="text-3xl font-bold font-montserrat text-foreground tracking-tight">Checkout</h1>
        <p className="text-muted-foreground mt-2 font-medium">Selesaikan pesanan Anda</p>
      </div>

      <CheckoutClient item={serializedItem} cars={cars} />
    </div>
  );
}
