import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const Hero_Images = {
  desktop: "/assets/landingpage.png",
  mobile: "/assets/landingpagemobile.png",
}

const HeroSection = () => {
  return (
    <div className="relative flex items-center w-full h-[80vh] overflow-hidden bg-white">
      <div className="absolute inset-0">
        <Image
          src={Hero_Images.desktop}
          alt="Home Background"
          fill
          priority
          className="hidden md:block object-cover object-center"
          draggable={false}
          sizes="(min-width: 768px) 100vw, 0px"
          quality={90}
        />
        <Image
          src={Hero_Images.mobile}
          alt="Home Background"
          fill
          priority
          className="md:hidden object-cover object-center"
          draggable={false}
          sizes="(max-width: 767px) 100vw, 0px"
          quality={90}
        />
      </div>
      {/* Blobs */}
      {/* <div className="absolute top-[-10%] left-[-15%] w-[70%] h-[40%] bg-[#e8f6ff] rounded-full blur-3xl" /> */}
      {/* <div className="absolute top-[0%] right-[-5%] w-[60%] h-[20%] bg-[#e8f6ff] rounded-full blur-3xl" /> */}
      {/* <div className="bg-linear-to-r from-black to-[#0E4B84]/0" /> */}

      {/* Desktop Fade */}
      <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-linear-to-r from-[#f8f8f8]/50 to-[#f8f8f8]/0" />
      {/* Mobile Fade */}
      <div className="md:hidden absolute top-0 left-[-20%] w-full h-full bg-[#f8f8f8]/50 rounded-full blur-3xl" />

      <div className="container mx-auto relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 px-6 py-12">
        {/* Left Column */}
        <div className="flex flex-col gap-6 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="font-edu text-4xl md:text-5xl font-bold text-stone-900 mb-6 max-w-3xl">
            {/* font-medium font-serif */}
            Pick <span className="">Products</span>
            <br />
            <span className="text-[#0E4B84]">
              Build Your <span className="">Routine</span>
            </span>{" "}
            <br />
            <span className="">Improve</span> Your Skin!
          </h1>

          <p className="hidden md:block text-sm md:text-lg text-stone-500 leading-relaxed max-w-lg mb-4 delay-150 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
            Your skincare organizer to help you improve your skin, save money,
            and age beautifully.
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
            <Link href="/routines" passHref>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto transition-all hover:shadow-lg hover:shadow-[#0E4B84]/20"
              >
                View Routines
              </Button>
            </Link>
          </div>
        </div>
        {/* Left */}
        <div className="relative h-[350px] hidden lg:block delay-500 animate-in fade-in zoom-in-95 duration-1000 fill-mode-backwards">
          {/* With bg image, leaving right side avail is nice */}
          {/* <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden transform -rotate-1 transition-transform duration-500">
            <Image
              src="/assets/home.jpg"
              alt="ClearUp Interface"
              fill
              draggable={false}
              className="object-cover opacity-90"
              sizes="(max-width: 768px) 100vw"
              priority
            />
          </div> */}
          {/* Floating Element 1 (e.g., A scraped target category) */}
          {/* <div className="absolute -right-20 -top-10 bg-white p-4 rounded-xl shadow-xl border border-zinc-100 flex items-center gap-4 rotate-1 transition-transform duration-500 cursor-default">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">Warning</p>
              <p className="text-xs text-stone-500">
                You will level up your skin.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
