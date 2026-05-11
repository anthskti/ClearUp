import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

import { ArrowRight, Sparkles, Droplets } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative flex items-center w-full h-[80vh] overflow-hidden bg-linear-to-tr from-white to-zinc-200">
      {/* <Image
        src="/assets/home.jpg" // EDIT BACKGROUND IMAGE TO BE WIDER
        alt="Home Background"
        fill
        className="object-cover"
        priority
      /> */}
      {/* Blobs */}
      <div className="absolute top-[-10%] left-[-15%] w-[70%] h-[40%] bg-[#e8f6ff] rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[50%] bg-[#e8f6ff] rounded-full blur-3xl" />

      <div className="container mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 px-6 py-12">
        {/* Left Column */}
        <div className="flex flex-col gap-6 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 text-sm font-medium w-fit mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Your Skincare Organizer</span>
          </div>
          <h1 className="text-5xl font-bold text-stone-900 mb-6 max-w-3xl">
            Pick Products. <br />
            <span className="text-[#0E4B84]">Build Your Routine.</span> <br />
            Improve Your Skin.
          </h1>

          <p className="text-lg text-stone-500 leading-relaxed max-w-lg mb-4 delay-150 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
            The organizer that helps you track your products, easily build
            routines, and figure out what actually works for your skin.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 delay-300 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
            <Link href="/builder" passHref>
              <Button
                variant="default"
                size="lg"
                className="w-full sm:w-auto gap-2 group transition-all hover:shadow-lg hover:shadow-[#0E4B84]/20"
              >
                Start Your Build
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/guides" passHref>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto transition-all hover:shadow-lg hover:shadow-[#0E4B84]/20"
              >
                View Guides
              </Button>
            </Link>
          </div>
        </div>
        {/* Left */}
        <div className="relative h-[350px] hidden lg:block delay-500 animate-in fade-in zoom-in-95 duration-1000 fill-mode-backwards">
          <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden transform -rotate-1 transition-transform duration-500">
            <Image
              src="/assets/home.jpg"
              alt="ClearUp Interface"
              fill
              className="object-cover opacity-90"
              priority
            />
          </div>
          {/* Floating Element 1 (e.g., A scraped target category) */}
          <div className="absolute -right-20 -top-10 bg-white p-4 rounded-xl shadow-xl border border-zinc-100 flex items-center gap-4 rotate-1 transition-transform duration-500 cursor-default">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Warning</p>
              <p className="text-xs text-stone-500">
                You will level up your skin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
