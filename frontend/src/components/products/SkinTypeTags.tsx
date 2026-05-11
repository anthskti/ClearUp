import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkinTypeTagsProps {
  skinTypes: string[]; // ex ["Dry", "Oily", "Combination"]
}

export const SkinTypeTags = ({ skinTypes }: SkinTypeTagsProps) => {
  if (!skinTypes || skinTypes.length === 0)
    return <span className="text-zinc-400 text-sm">-</span>;

  const firstType = skinTypes[0];
  const remainingCount = skinTypes.length - 1;

  return (
    <div className="flex flex-col items-start gap-1">
      {/* Show the first skin type */}
      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-md border border-teal-100 whitespace-nowrap">
        {firstType}
      </span>

      {/* +N badge */}
      {remainingCount > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-semibold rounded-md border border-zinc-200 hover:bg-zinc-200 transition-colors">
                +{remainingCount}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-zinc-900 text-white border border-zinc-700 shadow-md"
            >
              <p className="text-xs">{skinTypes.slice(1).join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};
