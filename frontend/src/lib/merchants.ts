import { Merchant } from "@/types/merchant";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

/** Merchant directory — changes only when seeded in admin. */
export const MERCHANT_DIRECTORY_REVALIDATE_SEC = 86400; // 24h

export const getAllMerchants = async (): Promise<Merchant[]> => {
  const res = await fetch(`${API_URL}/api/merchant`, {
    next: { revalidate: MERCHANT_DIRECTORY_REVALIDATE_SEC },
  });
  if (!res.ok) throw new Error("Failed to fetch merchants");
  return res.json();
};
