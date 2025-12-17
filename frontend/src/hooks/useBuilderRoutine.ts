import { useState, useEffect, useCallback } from "react";
import { Product, ProductCategory } from "@/types/product";
import { getMerchantsByProductId } from "@/lib/products";

export interface RoutineSlot {
  id: ProductCategory;
  label: string;
  // Allow multiple products per slot now
  products: Array<
    Product & {
      merchant?: string;
      merchantLogo?: string;
      merchantLink?: string;
    }
  >;
}

const ROUTINE_SLOTS: RoutineSlot[] = [
  { id: "cleanser", label: "Cleanser", products: [] },
  { id: "toner", label: "Toner", products: [] },
  { id: "essence", label: "Essence", products: [] },
  { id: "serum", label: "Serum", products: [] },
  { id: "moisturizer", label: "Moisturizer", products: [] },
  { id: "sunscreen", label: "Sunscreen", products: [] },
];

const STORAGE_KEY = "builder-routine";

export const useBuilderRoutine = () => {
  const [routine, setRoutine] = useState<RoutineSlot[]>(ROUTINE_SLOTS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Backwards compat: if older data has `product` (single), convert to `products` array
          const normalized: RoutineSlot[] = parsed.map((slot: any) => {
            if (slot.products) return slot;
            if (slot.product && slot.product !== null) {
              return { ...slot, products: [slot.product] };
            }
            return { ...slot, products: [] };
          });
          setRoutine(normalized);
        } catch (e) {
          console.error("Failed to parse saved routine", e);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever routine changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routine));
    }
  }, [routine, isLoaded]);

  const addProductToSlot = useCallback(
    async (category: ProductCategory, product: Product) => {
      // Add product to the array for the slot if not already present
      setRoutine((prev) =>
        prev.map((slot) =>
          slot.id === category
            ? {
                ...slot,
                products: slot.products.some((p) => p.id === product.id)
                  ? slot.products
                  : [
                      ...slot.products,
                      {
                        ...product,
                        merchant: "-",
                        merchantLogo: "-",
                      },
                    ],
              }
            : slot
        )
      );

      // Fetch merchant info for this product and update only that product entry
      try {
        const merchants = await getMerchantsByProductId(String(product.id));
        if (merchants && merchants.length > 0) {
          const bestOffer = merchants.sort((a, b) => a.price - b.price)[0];

          setRoutine((prev) =>
            prev.map((slot) =>
              slot.id === category
                ? {
                    ...slot,
                    products: slot.products.map((p) =>
                      p.id === product.id
                        ? {
                            ...p,
                            // price: bestOffer.price, // Uncomment to override price with best offer
                            merchant: bestOffer.merchant?.name || "Unknown",
                            merchantLogo: bestOffer.merchant?.logo || "-",
                            merchantLink: bestOffer.website,
                            // keep the original price unless you want to override
                          }
                        : p
                    ),
                  }
                : slot
            )
          );
        } else {
          setRoutine((prev) =>
            prev.map((slot) =>
              slot.id === category
                ? {
                    ...slot,
                    products: slot.products.map((p) =>
                      p.id === product.id
                        ? {
                            ...p,
                            merchant: "Direct",
                            merchantLogo: "/placeholder-logo.png",
                          }
                        : p
                    ),
                  }
                : slot
            )
          );
        }
      } catch (e: any) {
        console.error("Failed to fetch merchants details for product", e);
      }
    },
    []
  );

  // If productId is provided, remove that single product from the slot;
  // otherwise clear all products from the slot.
  const removeProductFromSlot = useCallback(
    (category: ProductCategory, productId?: number | string) => {
      setRoutine((prev) =>
        prev.map((slot) => {
          if (slot.id !== category) return slot;
          if (!productId) return { ...slot, products: [] };
          return {
            ...slot,
            products: slot.products.filter(
              (p) => String(p.id) !== String(productId)
            ),
          };
        })
      );
    },
    []
  );

  const clearRoutine = useCallback(() => {
    setRoutine(ROUTINE_SLOTS);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Listen for products added from other pages
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    const handleAddToRoutine = (event: CustomEvent) => {
      const { product, category } = event.detail;
      addProductToSlot(category, product);
      localStorage.removeItem("pending-routine-add");
    };

    window.addEventListener(
      "addToRoutine",
      handleAddToRoutine as EventListener
    );

    // Check for pending add in localStorage (from page navigation)
    const checkPendingAdd = () => {
      const pendingAdd = localStorage.getItem("pending-routine-add");
      if (pendingAdd) {
        try {
          const data = JSON.parse(pendingAdd);
          // Only process if it's recent (within last 30 seconds)
          if (Date.now() - data.timestamp < 30000) {
            addProductToSlot(data.category, data.product);
          }
          localStorage.removeItem("pending-routine-add");
        } catch (e) {
          console.error("Failed to parse pending routine add", e);
          localStorage.removeItem("pending-routine-add");
        }
      }
    };

    // Check immediately and also set up delays for navigation timing
    checkPendingAdd();
    const timeoutId1 = setTimeout(checkPendingAdd, 100);
    const timeoutId2 = setTimeout(checkPendingAdd, 500);
    const timeoutId3 = setTimeout(checkPendingAdd, 1000);

    return () => {
      window.removeEventListener(
        "addToRoutine",
        handleAddToRoutine as EventListener
      );
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [isLoaded, addProductToSlot]);

  return {
    routine,
    isLoaded,
    addProductToSlot,
    removeProductFromSlot,
    clearRoutine,
  };
};
