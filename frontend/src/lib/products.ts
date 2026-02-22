import { Product } from "@/types/product";
import { ProductMerchantWithDetails } from "@/types/merchant";

// 21600 seconds = 6 hours

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products`, {
    next: { revalidate: 21600 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
};

export const getProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products/category/${category}`, {
    next: { revalidate: 21600 },
  });

  if (!res.ok) {
    console.error(`Failed to fetch category: ${category}`);
    return [];
  }
  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/id/${id}`, {
    next: { revalidate: 21600 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  return res.json();
};

export const getMerchantsByProductId = async (
  productId: string,
): Promise<ProductMerchantWithDetails[]> => {
  const res = await fetch(`${API_URL}/products/id/${productId}/merchants`, {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`Failed to fetch merchants for product: ${productId}`);
    return [];
  }
  return res.json();
};

export const addMerchantByProductId = async (
  id: number,
  merchantData: {
    merchantId: number;
    website: string;
    price: number;
    stock: boolean;
    shipping: string;
  },
): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/id/${id}/merchants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(merchantData),
  });
  if (!res.ok) {
    throw new Error(`Failed to add merchant to id: ${id}`);
  }
  return res.json();
};
