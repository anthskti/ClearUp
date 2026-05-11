import { Product } from "./product";
export interface Merchant {
  id: number;
  name: string;
  logo: string;
}

export type CreateMerchantInput = Pick<Merchant, "name" | "logo">;
export type UpdateMerchantInput = Partial<CreateMerchantInput>;

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

export type ProductMerchantWriteFields = Pick<
  ProductMerchant,
  "productId" | "merchantId" | "website" | "price" | "stock" | "shipping"
>;
export type CreateProductMerchantInput = ProductMerchantWriteFields;
export type UpdateProductMerchantInput = Partial<
  Pick<ProductMerchant, "website" | "price" | "stock" | "shipping">
>;

export type ProductMerchantWithDetails = ProductMerchant & {
  merchant?: Pick<Merchant, "id" | "name" | "logo">;
};

export interface ProductWithMerchants extends Product {
  products?: ProductMerchantWithDetails[];
}
