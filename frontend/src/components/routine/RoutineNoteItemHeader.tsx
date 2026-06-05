import type { ProductCategory } from "@/types/product";

interface RoutineNoteItemHeaderProps {
  stepOrder: number;
  productName: string;
  productBrand: string;
  category: ProductCategory;
}

export default function RoutineNoteItemHeader({
  stepOrder,
  productName,
  productBrand,
  category,
}: RoutineNoteItemHeaderProps) {
  return (
    <>
      <div className="font-bold text-zinc-900 text-sm">
        Step {stepOrder} · {productBrand}  {productName}
      </div>
      <div className="text-xs text-zinc-400 uppercase mb-1">
        {category}
      </div>
    </>
  );
}
