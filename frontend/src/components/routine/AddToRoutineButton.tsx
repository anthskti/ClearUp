"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductCategory } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddToRoutineButtonProps {
  product: Product;
  category: string;
  className?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  compact?: boolean;
}

function AddToRoutineButton({
  product,
  category,
  className = "",
  variant = "secondary",
  size = "default",
  compact = false,
}: AddToRoutineButtonProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToRoutine = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    // Store product in localStorage for builder page to pick up
    const addToRoutineData = {
      product,
      category: category as ProductCategory,
      timestamp: Date.now(),
    };

    // Store in localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "pending-routine-add",
          JSON.stringify(addToRoutineData)
        );

        // Dispatch a custom event in case builder page is already open
        window.dispatchEvent(
          new CustomEvent("addToRoutine", {
            detail: addToRoutineData,
          })
        );

        // Redirect to builder page
        router.push("/builder");
      } catch (error) {
        console.error("Failed to add product to routine:", error);
        alert("Failed to add product to routine. Please try again.");
        setIsAdding(false);
      }
    }
  };

  return (
    <Button
      onClick={handleAddToRoutine}
      disabled={isAdding}
      variant={variant}
      size={size}
      className={className}
    >
      {
        // isAdding ? (
        //   "Adding..."
        // ) :
        compact ? (
          "Add"
        ) : (
          <>
            <Plus size={18} />
            Add to Routine
          </>
        )
      }
    </Button>
  );
}

export default AddToRoutineButton;
