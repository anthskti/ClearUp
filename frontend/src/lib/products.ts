import { Product } from "@/types/product";
import { Merchant } from "@/types/merchant";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }
  return res.json();
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const res = await fetch(`${API_URL}/products/category/${category}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Failed to fetch category: ${category}`);
    return [];
  }
  return res.json();
};

export const getProductById = async (id: string): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/id/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  return res.json();
};

export const getMerchantsByProductId = async (
  productId: string
): Promise<Merchant[]> => {
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
  id: string
  // data: merchantData?
): Promise<Product> => {
  const res = await fetch(`${API_URL}/products/id/${id}/merchants`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}`);
  }
  return res.json();
};
