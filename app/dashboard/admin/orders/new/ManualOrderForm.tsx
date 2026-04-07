"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createManualOrderAction } from "@/features/admin/actions";
import { toast } from "@/lib/toast-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { rupiahConverter } from "@/features/catalog/lib";
import { Product } from "@prisma/client";
import { Trash2, Plus } from "lucide-react";

export function ManualOrderForm({ products }: { products: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  
  const [selectedItems, setSelectedItems] = useState<{ productId: number; quantity: number }[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const availableProducts = products.filter(
    (p) => !selectedItems.find((s) => s.productId === p.id) && 
           p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (productId: string) => {
    if (!productId) return;
    const id = parseInt(productId, 10);
    setSelectedItems([...selectedItems, { productId: id, quantity: 1 }]);
  };

  const removeItem = (productId: number) => {
    setSelectedItems(selectedItems.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setSelectedItems(
      selectedItems.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const p = products.find((x) => x.id === item.productId);
      if (p) {
        return total + Number(p.price) * item.quantity;
      }
      return total;
    }, 0);
  }, [selectedItems, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !carBrand || !carModel) {
      toast.error("Mohon lengkapi semua data pelanggan dan kendaraan");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Pilih minimal satu produk atau layanan");
      return;
    }

    startTransition(async () => {
      const itemsToSubmit = selectedItems.map((item) => {
        const p = products.find((x) => x.id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          priceAtBooking: Number(p?.price || 0),
        };
      });

      const res = await createManualOrderAction({
        customerName,
        customerPhone,
        carBrand,
        carModel,
        items: itemsToSubmit,
        totalAmount,
      });

      if (res.success) {
        toast.success("Pesanan manual berhasil dibuat!");
        router.push("/dashboard/admin/orders");
        router.refresh();
      } else {
        toast.error(res.error || "Gagal membuat pesanan");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border/50 p-6 md:p-8 rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b border-border/50 pb-2">Informasi Pelanggan</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Nama Pelanggan / Walk-in</label>
            <Input 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              placeholder="Contoh: Budi Susanto" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Nomor WhatsApp / HP</label>
            <Input 
              value={customerPhone} 
              onChange={(e) => setCustomerPhone(e.target.value)} 
              placeholder="Contoh: 08123456789" 
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg border-b border-border/50 pb-2">Informasi Kendaraan</h3>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Merk Mobil</label>
            <Input 
              value={carBrand} 
              onChange={(e) => setCarBrand(e.target.value)} 
              placeholder="Contoh: Toyota, Honda" 
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Model Kendaraan</label>
            <Input 
              value={carModel} 
              onChange={(e) => setCarModel(e.target.value)} 
              placeholder="Contoh: Avanza G 2021" 
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg border-b border-border/50 pb-2">Produk / Layanan Transaksi</h3>
        
        <div className="space-y-4">
          <Input 
            placeholder="Cari nama produk atau layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 max-h-[300px] overflow-y-auto border border-border/50 rounded-lg bg-muted/10">
             {availableProducts.map(p => (
               <div 
                 key={p.id} 
                 onClick={() => addItem(p.id.toString())}
                 className="flex border-b border-r border-border/50 items-center justify-between gap-3 p-3 hover:bg-muted/40 transition-colors cursor-pointer group" 
               >
                  <div className="flex items-center gap-3">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0].url} alt={p.name} className="w-12 h-12 object-cover rounded-md shrink-0" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-[10px] text-muted-foreground shrink-0 text-center leading-none">TANPA<br/>FOTO</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <p className="text-xs text-primary font-bold">{rupiahConverter(Number(p.price))}</p>
                      {p.stock !== null && <p className="text-[10px] text-muted-foreground mt-0.5">Stok: {p.stock}</p>}
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="icon" className="h-8 w-8 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                    <Plus className="w-4 h-4" />
                  </Button>
               </div>
             ))}
             {availableProducts.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm col-span-full">
                  Produk tidak ditemukan atau sudah dipilih.
                </div>
             )}
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="border border-border/50 rounded-lg overflow-hidden mt-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 uppercase text-xs font-bold text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-4 py-3">Produk</th>
                  <th className="px-4 py-3 w-32">Harga Satuan</th>
                  <th className="px-4 py-3 w-32">Jumlah</th>
                  <th className="px-4 py-3 w-32">Subtotal</th>
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {selectedItems.map((item) => {
                  const p = products.find((x) => x.id === item.productId);
                  if (!p) return null;
                  const price = Number(p.price);
                  return (
                    <tr key={item.productId} className="bg-background">
                      <td className="px-4 py-3 font-semibold">{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rupiahConverter(price)}</td>
                      <td className="px-4 py-3">
                        <Input 
                          type="number" 
                          min="1"
                          max={p.stock !== null ? p.stock : undefined}
                          className="w-20 h-8 font-semibold"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td className="px-4 py-3 font-bold">{rupiahConverter(price * item.quantity)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-border/50">
         <div>
            <p className="text-sm text-muted-foreground">Status akan otomatis dibuat sebagai <b>Sedang Dikerjakan</b> dan pembayaran <b>Bayar di Bengkel</b>.</p>
         </div>
         <div className="text-right">
           <p className="text-sm font-bold text-muted-foreground mb-1">Total Tagihan</p>
           <p className="text-2xl font-black text-primary">{rupiahConverter(totalAmount)}</p>
         </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-border/50">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.back()}
          disabled={isPending}
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          disabled={isPending || selectedItems.length === 0}
        >
          {isPending ? "Menyimpan..." : "Simpan Pesanan Manual"}
        </Button>
      </div>
    </form>
  );
}
