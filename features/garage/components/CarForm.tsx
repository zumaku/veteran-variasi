"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { carSchema, type CarInput } from "../validations";
import { createCarAction, updateCarAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Camera, Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/lib/toast-store";

interface CarFormProps {
  userId: number;
  car?: any;
}

export function CarForm({ userId, car }: CarFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(car?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isEdit = !!car;

  const form = useForm<CarInput>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      id: car?.id,
      userId: userId,
      brand: car?.brand || "",
      model: car?.model || "",
      year: car?.year || new Date().getFullYear(),
      licensePlate: car?.licensePlate || "",
      image: car?.image || null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a local URL for the preview - more efficient than FileReader
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  async function onSubmit(data: CarInput) {
    const formData = new FormData();
    if (isEdit && data.id) formData.append("id", data.id.toString());
    formData.append("userId", userId.toString());
    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("year", data.year.toString());
    formData.append("licensePlate", data.licensePlate);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const action = isEdit ? updateCarAction : createCarAction;
    const result = await action(null, formData);

    if (result?.success) {
      toast.success(result.message);
      router.push("/dashboard/user/profile");
      router.refresh();
    } else {
      toast.error(result?.message || "Terjadi kesalahan.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <Link 
            href="/dashboard/user/profile" 
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4 group"
        >
            <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Kembali
        </Link>
        <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Mobil" : "Tambah Mobil Baru"}
        </h1>
        <p className="text-muted-foreground mt-2">
            {isEdit 
                ? "Ubah detail informasi kendaraan Anda." 
                : "Masukkan informasi kendaraan Anda untuk memudahkan booking."}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 md:p-8 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Photo Section */}
            <div className="space-y-4">
              <Label className="text-sm font-bold uppercase tracking-wider opacity-60">
                Foto Mobil
              </Label>
              <div className="flex flex-col items-center gap-4">
                <div 
                    className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed bg-muted flex items-center justify-center cursor-pointer group hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <img
                        src={imagePreview} 
                        alt="Preview Mobil" 
                        className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Camera className="h-12 w-12 mb-3 opacity-20" />
                        <span className="font-medium">Klik untuk tambah foto</span>
                        <span className="text-xs opacity-60 mt-1">Format: JPG, PNG, WEBP (Maks. 5MB)</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30">
                        <Camera className="text-white h-6 w-6" />
                      </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Brand</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contoh: Honda" 
                        {...field} 
                        className="h-12 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Model</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contoh: HR-V" 
                        {...field} 
                        className="h-12 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Tahun</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Contoh: 2022" 
                        {...field}
                        className="h-12 rounded-xl"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Nomer Plat</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Contoh: B 1234 ABC" 
                        {...field} 
                        className="h-12 rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-4 flex gap-4">
              <Link href="/dashboard/user/profile" className="flex-1">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-xl font-bold"
                >
                    Batal
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="flex-1 h-12 rounded-xl font-bold"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  isEdit ? "Simpan Perubahan" : "Simpan Mobil"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
