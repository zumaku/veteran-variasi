"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddEditCarDialog } from "./AddEditCarDialog";
import { CarWithLastService } from "../types";
import { getRelativeTimeString } from "../utils/getRelativeTimeString";

interface CarCardProps {
  car: CarWithLastService;
  userId: number;
}

export function CarCard({ car, userId }: CarCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const lastService = car.orders[0]?.bookingDate;
  const lastServiceText = lastService
    ? getRelativeTimeString(new Date(lastService))
    : "Belum ada";

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border shadow-sm group hover:shadow-md transition-all h-full flex flex-col min-h-[420px]">
      {/* Image Section */}
      <div className="relative w-full h-48 bg-muted overflow-hidden shrink-0 border-b">
        <Image
          src={car.image || "/top-down-car.png"}
          alt={`${car.brand} ${car.model}`}
          className="aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          width={1000}
          height={1000}
        />
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-3">
        <div>
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-foreground leading-tight">
              {car.brand} {car.model}
            </h3>
            <p className="text-base text-muted-foreground">{car.year} Model</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nomer Plat</p>
              <p className="text-base font-bold text-foreground">
                {car.licensePlate}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-muted-foreground">
                Terakhir Diservice
              </p>
              <p className="text-base font-bold text-foreground">
                {lastServiceText}
              </p>
            </div>
          </div>
        </div>

        <Button variant="dark" onClick={() => setShowEditDialog(true)}>
          Detail
        </Button>
      </div>

      <AddEditCarDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        userId={userId}
        car={car}
      />
    </div>
  );
}
