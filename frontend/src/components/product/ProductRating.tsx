import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STAR_COUNT = 5;

type ProductRatingProps = {
  averageRating: number;
  reviewCount?: number;
  variant?: "compact" | "detail";
  className?: string;
  align?: "start" | "center";
};

function formatRating(rating: number): string {
  if (rating <= 0) return "—";
  return Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
}

function starFillPercent(rating: number, index: number): number {
  return Math.min(Math.max(rating - index, 0), 1) * 100;
}

function formatReviewCount(count: number): string {
  if (count === 1) return "1 review";
  return `${count} reviews`;
}

function PartialStar({
  fillPercent,
  size,
}: {
  fillPercent: number;
  size: number;
}) {
  return (
    <span
      className="relative inline-block shrink-0 leading-none"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Star size={size} className="text-zinc-200" />
      {fillPercent > 0 ? (
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <Star size={size} className="fill-yellow-500 text-yellow-500" />
        </span>
      ) : null}
    </span>
  );
}

function StarRow({
  rating,
  size,
  gapClass,
}: {
  rating: number;
  size: number;
  gapClass: string;
}) {
  return (
    <span className={cn("inline-flex items-center", gapClass)}>
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <PartialStar
          key={index}
          fillPercent={starFillPercent(rating, index)}
          size={size}
        />
      ))}
    </span>
  );
}

export default function ProductRating({
  averageRating,
  reviewCount = 0,
  variant = "compact",
  className,
  align = "center",
}: ProductRatingProps) {
  const hasRating = averageRating > 0;
  const hasReviews = reviewCount > 0;
  const formattedRating = formatRating(averageRating);

  const ariaLabel = hasRating
    ? `Rated ${formattedRating} out of 5 stars${
        hasReviews ? `, ${formatReviewCount(reviewCount)}` : ""
      }`
    : "Not rated yet";

  if (variant === "compact") {
    if (!hasRating) {
      return (
        <span className={cn("text-xs text-zinc-400", className)} aria-hidden>
          —
        </span>
      );
    }

    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={cn(
          "flex items-center gap-0.5 text-xs text-yellow-600",
          align === "start" ? "justify-start" : "justify-center",
          className,
        )}
      >
        <Star size={14} className="shrink-0 fill-yellow-500 text-yellow-500" />
        <span className="font-medium text-zinc-800">{formattedRating}</span>
      </div>
    );
  }

  if (!hasRating) {
    return (
      <p className={cn("text-sm text-zinc-400", className)}>Not rated yet</p>
    );
  }

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", className)}
    >
      <StarRow rating={averageRating} size={18} gapClass="gap-0.5" />
      <span className="text-sm font-semibold text-zinc-900">
        {formattedRating}
      </span>
      {hasReviews ? (
        <span className="text-sm text-zinc-400">
          ({formatReviewCount(reviewCount)})
        </span>
      ) : null}
    </div>
  );
}
