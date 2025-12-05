import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="relative w-full h-[110vh] overflow-hidden">
      <Image
        src="/assets/home.jpg"
        alt="Home Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-white/40" />

      <div className="container mx-auto relative flex flex-col justify-center h-full">
        <h1 className="text-5xl font-bold text-stone-900 mb-6 max-w-3xl ">
          Pick Products. <br />
          Build Your Routine. <br />
          Improve Your Skin.
        </h1>

        <div className="flex gap-2 flex-col">
          <Link href="/builder" passHref>
            {/* input icon */}
            <button className="bg-[#F8F8F8] hover:bg-gray-400 text-black hover:text-stone-800 px-6 py-2 rounded-md text-md items-center gap-2 transition colors duration-200">
              Start Your Build
            </button>
          </Link>
          <Link href="/" passHref>
            {/* input icon */}
            <button className="bg-[#0E4B84] hover:bg-[#0A345C] text-[#F8F8F8] hover:text-gray-400 px-6 py-2 rounded-md text-md items-center gap-2 transition colors duration-200">
              View Guides
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
