import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <Image
        src="/assets/home.jpg" // EDIT BACKGROUND IMAGE TO BE WIDER
        alt="Home Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="container mx-auto relative flex flex-col justify-center h-full">
        <h1 className="text-5xl font-bold text-stone-900 mb-6 max-w-3xl">
          Pick Products. <br />
          Build Your Routine. <br />
          Improve Your Skin.
        </h1>

        <div className="flex gap-2 flex-col">
          <Link href="/builder" passHref>
            {/* Input icon */}
            <Button variant="default" size="lg">
              Start Your Build
            </Button>
          </Link>
          <Link href="/guides" passHref>
            {/* Input icon */}
            <Button variant="secondary" size="lg">
              View Guides
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
