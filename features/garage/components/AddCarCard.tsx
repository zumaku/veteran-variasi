"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

interface AddCarCardProps {
  userId: number;
}

export function AddCarCard({ userId }: AddCarCardProps) {
  return (
    <Link
      href="/dashboard/user/garage/new"
      className="h-full w-full border-2 border-dashed border-muted rounded-2xl flex flex-col items-center justify-center p-12 gap-5 hover:border-primary/50 hover:bg-primary/5 transition-all group min-h-[420px]"
    >
      <div className="bg-muted p-6 rounded-full group-hover:bg-primary/10 transition-colors">
        <Plus className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-transform group-hover:scale-110" />
      </div>
      <div className="text-center space-y-1">
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary transition-colors">
            Tambah Mobil Baru
          </p>
          <p className="text-sm text-muted-foreground opacity-70">
            Daftarkan kendaraan lainnya
          </p>
      </div>
    </Link>
  );
}
