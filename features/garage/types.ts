import { Car as PrismaCar, Order } from "@prisma/client";

export interface CarWithLastService extends PrismaCar {
  orders: Order[];
}
