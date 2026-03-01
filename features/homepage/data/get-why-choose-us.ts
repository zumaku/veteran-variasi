import { prisma } from "@/lib/prisma";

/**
 * Retrieves the "Why Choose Us" selling points dynamically from the database settings
 * This exists to allow administrators to update marketing copy directly via the CMS without requiring code deployments
 * @returns Array containing objects with title and description strings, or undefined if settings don't exist
 */
export default async function getWhyChooseUs() {
  const settings = await prisma.setting.findFirst();

  return settings?.whyChooseUs as {
    title: string;
    description: string;
  }[];
}