import { Product } from "@prisma/client";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-shadow group flex flex-col items-center">
      <div className="w-full aspect-[4/3] bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
          <Image src={product.image || ""} alt={product.name} width={1000} height={1000} />
        </div>
      </div>
      <div className="p-6 text-left w-full">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-6">
          {product.description}
        </p>
        <div className="w-12 h-1 bg-primary/20 rounded-full mb-6 relative overflow-hidden">
          <div className="absolute -left-full top-0 h-full w-full bg-primary/40 group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold font-montserrat text-foreground">
            Rp. {product.price.toNumber().toLocaleString("id-ID")}
          </span>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 text-sm font-semibold rounded-md hover:bg-secondary/90 transition-colors">
            Pesan
          </button>
        </div>
      </div>
    </div>
  );
}
