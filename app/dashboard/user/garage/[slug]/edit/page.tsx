import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { CarForm } from "@/features/garage/components/CarForm";
import { getCarBySlug } from "@/features/garage/data/cars";

interface EditCarPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { slug } = await params;
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  const userId = (session as any).userId;
  const car = await getCarBySlug(slug);

  if (!car || car.userId !== userId) {
    notFound();
  }

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      <CarForm userId={userId} car={car} />
    </div>
  );
}
