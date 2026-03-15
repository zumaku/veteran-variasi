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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface AddEditCarDialogProps {
  userId: number;
  car?: any; // If provided, we are in Edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEditCarDialog({
  userId,
  car,
  open,
  onOpenChange,
}: AddEditCarDialogProps) {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      onOpenChange(false);
      router.refresh();
      if (!isEdit) {
          form.reset();
          setImagePreview(null);
          setImageFile(null);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {isEdit ? "Edit Mobil" : "Tambah Mobil Baru"}
              </DialogTitle>
              <DialogDescription>
                {isEdit 
                  ? "Ubah detail informasi kendaraan Anda." 
                  : "Masukkan informasi kendaraan Anda untuk memudahkan booking."}
              </DialogDescription>
            </DialogHeader>

            {/* Photo Section */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-wider opacity-60">
                Foto Mobil
              </Label>
              <div className="flex flex-col items-center gap-4">
                <div 
                    className="relative w-full aspect-video rounded-xl overflow-hidden border bg-muted flex items-center justify-center cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <Image 
                        src={imagePreview} 
                        alt="Preview Mobil" 
                        fill 
                        className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Camera className="h-10 w-10 mb-2 opacity-20" />
                        <span className="text-sm">Klik untuk tambah foto</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white h-8 w-8" />
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Honda" {...field} />
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
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: HR-V" {...field} />
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
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Contoh: 2022" 
                        {...field}
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
                    <FormLabel>Nomer Plat</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: B 1234 ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4 gap-3 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl h-11"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
                className="flex-1 rounded-xl h-11"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  isEdit ? "Perbarui" : "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
