import Link from "next/link";
import Carousel from "../ui/Carousel";
import type { SkinType } from "@/types/product";

interface Match {
  label: string;
  skinType: SkinType;
}

/** Home-page skin concern cards → filtered category catalog links. */
const MATCHES: Match[] = [
  { label: "Normal", skinType: "normal" },
  { label: "Acne Prone", skinType: "acne-prone" },
  { label: "Combination", skinType: "combination" },
  { label: "Oil Control", skinType: "oily" },
  { label: "Dryness", skinType: "dry" },
  { label: "Sensitivity", skinType: "sensitive" },
];

function matchHref(skinType: SkinType): string {
  const qs = new URLSearchParams({ skinType });
  return `/products?${qs.toString()}`;
}

const MatchCard = ({ label, skinType }: Match) => (
  <Link
    href={matchHref(skinType)}
    className="
      group flex flex-col items-center justify-center
      w-full aspect-2/3
      bg-[#e8f6ff] hover:bg-[#87a1b1]
      rounded-sm shadow-sm transition-all duration-300
      text-zinc-900 hover:text-white font-medium
    "
  >
    {label}
  </Link>
);

const Matches = () => {
  return (
    <section>
      <div className="py-10 px-4 md:px-8 w-full mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-zinc-900">
            Find Your Perfect Match
          </h2>
        </div>

        {/* Mobile */}
        <div className="lg:hidden w-full max-w-sm mx-auto px-4">
          <Carousel>
            {MATCHES.map((item) => (
              <MatchCard key={item.skinType} {...item} />
            ))}
          </Carousel>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-6 gap-4 w-full max-w-7xl mx-auto">
          {MATCHES.map((item) => (
            <MatchCard key={item.skinType} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Matches;
