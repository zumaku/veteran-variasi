import { prisma } from "@/lib/prisma";

export async function getFAQsData() {
    const faqs = await prisma.faqs.findMany({
        take: 3,
        orderBy: {
            createdAt: "desc",
        },
    });
    return faqs;
}