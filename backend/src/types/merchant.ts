import { Product } from "./product";
export interface Merchant {
  id: number;
  name: string;
  logo: string;
}
export interface ProductMerchant {
  id: number;
  productId: number;
  merchantId: number;
  website: string;
  price: number;
  stock: boolean;
  shipping: string;
  lastUpdated: Date;
}

export interface ProductWithMerchants extends Product {
  products?: ProductMerchant[];
}
