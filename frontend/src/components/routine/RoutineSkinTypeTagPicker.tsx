"use client";

import type { SkinType } from "@/types/product";
import {
  ROUTINE_SKIN_TYPE_OPTIONS,
  skinTypeLabel,
} from "@/lib/routineSkinTypeTags";

interface RoutineSkinTypeTagPickerProps {
  value: SkinType[];
  onToggle?: (tag: SkinType) => void;
  disabled?: boolean;
  className?: string;
}

export default function RoutineSkinTypeTagPicker({
  value,
  onToggle,
  disabled = false,
  className = "",
}: RoutineSkinTypeTagPickerProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {ROUTINE_SKIN_TYPE_OPTIONS.map((tag) => {
        const selected = value.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onToggle?.(tag)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selected
                ? "bg-blue-100 text-blue-900 ring-1 ring-blue-200"
                : disabled
                  ? "bg-zinc-50 text-zinc-400"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {skinTypeLabel(tag)}
          </button>
        );
      })}
    </div>
  );
}
