import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Carousel from "../ui/Carousel";

interface Match {
  id: string;
  label: string;
  color: string;
}

const MATCHES = [
  { id: "acne", label: "Acne Prone", color: "" },
  { id: "Combination", label: "Combination", color: "" },
  { id: "Oily", label: "Oil Control", color: "" },
  { id: "Dry", label: "Dryness", color: "" },
  { id: "Sensitive", label: "Sensitivity", color: "" },
  { id: "Anti-Aging", label: "Anti-Aging", color: "" },
];

const Matches = () => {
  const MatchCard = ({ label }: Match) => (
    <button
      className={`
        group flex flex-col items-center justify-center
        w-full aspect-2/3 
        bg-[#e8f6ff] hover:bg-[#87a1b1]
        rounded-sm shadow-sm transition-all duration-300
        text-zinc-900 hover:text-white font-medium
      `}
    >
      {label}
    </button>
  );
  return (
    <section className="py-10 px-4 md:px-8 w-full mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-xl font-bold text-zinc-900">
          Find Your Perfect Match
        </h2>
      </div>

      {/* Mobile */}
      <div className="lg:hidden w-full max-w-sm mx-auto px-4">
        <Carousel>
          {MATCHES.map((item) => (
            <MatchCard
              key={item.id}
              id={item.id}
              label={item.label}
              color={""}
            />
          ))}
        </Carousel>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-6 gap-4 w-full max-w-7xl mx-auto">
        {MATCHES.map((item) => (
          <MatchCard key={item.id} id={item.id} label={item.label} color={""} />
        ))}
      </div>
    </section>
  );
};

export default Matches;
