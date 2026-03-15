import { prisma } from "@/lib/prisma";

export async function getUserCars(userId: number) {
  const cars = await prisma.car.findMany({
    where: { userId },
    include: {
      orders: {
        where: {
          status: "COMPLETED",
        },
        orderBy: {
          bookingDate: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Serialize to plain objects to avoid Decimal errors in Next.js
  return JSON.parse(JSON.stringify(cars));
}

export async function getCarById(id: number) {
  return await prisma.car.findUnique({
    where: { id },
  });
}

export async function getCarBySlug(slug: string) {
  const car = await prisma.car.findUnique({
    where: { slug },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          bookingDate: "desc",
        },
      },
    },
  });

  return car ? JSON.parse(JSON.stringify(car)) : null;
}
