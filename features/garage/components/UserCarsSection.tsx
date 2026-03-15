import { getSession } from "@/lib/session";
import { getUserCars } from "../data/cars";
import { CarCard } from "./CarCard";
import { AddCarCard } from "./AddCarCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CarWithLastService } from "../types";

export default async function UserCarsSection() {
  const session = await getSession();
  
  if (!session) return null;
  
  const userId = (session as any).userId;
  const cars = await getUserCars(userId);

  return (
    <div className="space-y-6 mt-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Mobilku</h2>
          <p className="text-muted-foreground">
            Kelola kendaraanmu untuk booking pelayanan
          </p>
        </div>
        
        <Link href="/dashboard/user/garage/new">
            <Button className="hidden md:flex items-center gap-2 font-bold rounded-xl h-11">
              <Plus className="h-5 w-5" />
              Tambah Mobil Baru
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car: CarWithLastService) => (
          <CarCard key={car.id} car={car} userId={userId} />
        ))}
        <AddCarCard userId={userId} />
      </div>
    </div>
  );
}
