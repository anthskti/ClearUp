import type { RoutineSlot } from "@/hooks/useBuilderRoutine";

// Fields staying in localStorage to avoid full product staging.
// Assisting performance.
export type StoredBuilderProduct = {
  id: number;
  name: string;
  brand: string;
  price?: number;
  imageUrls?: string[];
  merchant?: string;
  merchantLogo?: string;
  merchantLink?: string;
};

export type StoredBuilderSlot = {
  id: RoutineSlot["id"];
  label: string;
  products: StoredBuilderProduct[];
};

export function slimRoutineForStorage(routine: RoutineSlot[]): StoredBuilderSlot[] {
  return routine.map((slot) => ({
    id: slot.id,
    label: slot.label,
    products: slot.products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      imageUrls: p.imageUrls?.length ? [p.imageUrls[0]] : [],
      merchant: p.merchant,
      merchantLogo: p.merchantLogo,
      merchantLink: p.merchantLink,
    })),
  }));
}

export function normalizeStoredSlots(raw: unknown): StoredBuilderSlot[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((slot: Record<string, unknown>) => {
    let products = (slot.products as StoredBuilderProduct[] | undefined) ?? [];
    if (products.length === 0 && slot.product) {
      products = [slot.product as StoredBuilderProduct];
    }

    return {
      id: slot.id as RoutineSlot["id"],
      label: String(slot.label ?? ""),
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls.slice(0, 1) : [],
        merchant: p.merchant,
        merchantLogo: p.merchantLogo,
        merchantLink: p.merchantLink,
      })),
    };
  });
}

export function expandStoredRoutine(slots: StoredBuilderSlot[]): RoutineSlot[] {
  return slots.map((slot) => ({
    ...slot,
    products: slot.products.map((p) => ({
      ...p,
      price: p.price ?? 0,
      imageUrls: p.imageUrls ?? [],
      category: slot.id,
      labels: [],
      skinType: [],
      country: "",
      capacity: "",
      instructions: [],
      averageRating: 0,
      reviewCount: 0,
    })) as RoutineSlot["products"],
  }));
}
