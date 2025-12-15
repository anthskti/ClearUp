import { useState, useEffect, useCallback } from "react";
import { Product, ProductCategory } from "@/types/product";

export interface RoutineSlot {
  id: ProductCategory;
  label: string;
  product: (Product & { merchant?: string; merchantLogo?: string }) | null;
}

const ROUTINE_SLOTS: RoutineSlot[] = [
  { id: "cleanser", label: "Cleanser", product: null },
  { id: "toner", label: "Toner", product: null },
  { id: "essence", label: "Essence", product: null },
  { id: "serum", label: "Serum", product: null },
  { id: "moisturizer", label: "Moisturizer", product: null },
  { id: "sunscreen", label: "Sunscreen", product: null },
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
          setRoutine(parsed);
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
    (category: ProductCategory, product: Product) => {
      setRoutine((prev) =>
        prev.map((slot) =>
          slot.id === category
            ? {
                ...slot,
                product: {
                  ...product,
                  merchant: "-", // Default merchant, can be enhanced later
                  merchantLogo: "-",
                },
              }
            : slot
        )
      );
    },
    []
  );

  const removeProductFromSlot = useCallback((category: ProductCategory) => {
    setRoutine((prev) =>
      prev.map((slot) =>
        slot.id === category ? { ...slot, product: null } : slot
      )
    );
  }, []);

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
