enum ProductType {
  ACCESSORY,
  SERVICE
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    type: ProductType;
    description: string | null;
    price: number;
    stock: number | null;
    image: string | null;
}