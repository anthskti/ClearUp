// Modal for adding a product note to a routine
"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductCategory } from "@/types/product";
import type { TimeOfDay } from "@/types/routine";

// Lean list for the picker — avoids passing full Product blobs into the modal.
export type ModalProductOption = {
  productId: number;
  name: string;
  brand: string;
  category: ProductCategory;
};

interface AddProductNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeOfDay: TimeOfDay;
  products: ModalProductOption[];
  excludedProductIds: number[];
  onConfirm: (
    productId: number,
    category: ProductCategory,
    userNote: string,
  ) => void;
}

function AddProductNoteModal({
  isOpen,
  onClose,
  timeOfDay,
  products,
  excludedProductIds,
  onConfirm,
}: AddProductNoteModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userNote, setUserNote] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedId(null);
    setUserNote("");
  }, [isOpen, timeOfDay]);

  const excluded = useMemo(
    () => new Set(excludedProductIds),
    [excludedProductIds],
  );

  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((p) => {
      const key = `${p.category}-${p.productId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [products]);

  const available = useMemo(
    () => uniqueProducts.filter((p) => !excluded.has(p.productId)),
    [uniqueProducts, excluded],
  );

  if (!isOpen || !mounted) return null;

  const selected = available.find((p) => p.productId === selectedId);
  const label = timeOfDay === "AM" ? "Morning" : "Night";

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected.productId, selected.category, userNote);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-black"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-1">Add {label} product note</h2>
        <p className="text-sm text-zinc-500 mb-4">
          From your routine, pick a product and explain how you use it!
        </p>

        {available.length === 0 ? (
          <p className="text-sm text-zinc-600 mb-4">
            {products.length === 0
              ? "Add products to your routine first, then attach notes here."
              : "Every product in your routine already has a note for this time."}
          </p>
        ) : (
          <div className="max-h-48 overflow-y-auto border border-zinc-200 rounded-md mb-4 divide-y divide-zinc-100">
            {available.map((product) => (
              <button
                key={`${product.category}-${product.productId}`}
                type="button"
                onClick={() => setSelectedId(product.productId)}
                className={`w-full text-left px-3 py-2.5 hover:bg-[#e9f6ff]/50 transition-colors ${
                  selectedId === product.productId
                    ? "bg-[#e9f6ff] ring-1 ring-inset ring-zinc-300"
                    : ""
                }`}
              >
                <div className="text-xs font-bold text-zinc-400 uppercase">
                  {product.category}
                </div>
                <div className="text-sm font-medium text-zinc-900">
                {product.brand} {product.name}
                </div>
              </button>
            ))}
          </div>
        )}

        <textarea
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          placeholder="How do you use this product in this step?"
          rows={3}
          disabled={!selected}
          className="w-full text-sm p-2 border border-zinc-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 resize-none"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleConfirm}
            disabled={!selected}
          >
            Add note
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default memo(AddProductNoteModal);
