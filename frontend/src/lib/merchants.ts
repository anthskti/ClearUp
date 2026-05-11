import { Merchant } from "@/types/merchant";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export const getAllMerchants = async (): Promise<Merchant[]> => {
  const res = await fetch(`${API_URL}/api/merchant`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch merchants");
  return res.json();
};
