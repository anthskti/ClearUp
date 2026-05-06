"use client";

import { Copy, ExternalLink } from "lucide-react";

interface RoutineShareLinkProps {
  routineId: string;
}

export default function RoutineShareLink({ routineId }: RoutineShareLinkProps) {
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/routine/${routineId}`
      : "";

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(shareUrl);
    }
  };

  return (
    <div className="flex items-center bg-white border border-zinc-200 rounded-md overflow-hidden shadow-sm max-w-md w-full md:w-auto">
      <div className="bg-zinc-50 px-3 py-2 border-r border-zinc-200 text-zinc-400">
        <ExternalLink size={16} />
      </div>
      <input
        readOnly
        value={shareUrl}
        className="px-4 py-2 text-sm text-zinc-600 outline-none w-full md:w-64 bg-transparent"
      />
      <button
        onClick={copyLink}
        className="px-4 py-2 hover:bg-zinc-50 border-l border-zinc-200 transition-colors"
      >
        <Copy size={16} className="text-zinc-500 hover:text-black" />
      </button>
    </div>
  );
}
