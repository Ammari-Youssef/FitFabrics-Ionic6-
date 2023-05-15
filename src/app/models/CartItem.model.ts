import { Product } from "./Product.model";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  timestamp: Date;

  
  
}
