import dynamic from "next/dynamic";

import { ScrollReveal } from "@/components/animations/ScrollReveal";
import HeroSection from "@/components/home/HeroSection";
import FeaturedRoutinesSection from "@/components/home/FeaturedRoutinesSection";
import TrustBanner from "@/components/home/TrustBanner";
const Matches = dynamic(() => import("@/components/home/Matches"), {
  loading: () => <div className="h-64 animate-pulse bg-zinc-50" />,
});

const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  loading: () => <div className="h-96 animate-pulse bg-zinc-50" />,
});

const Home = () => {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection />
      <ScrollReveal>
        <HowItWorks />
      </ScrollReveal>
      <ScrollReveal>
        <FeaturedRoutinesSection />
      </ScrollReveal>
      <ScrollReveal>
        <Matches />
      </ScrollReveal>
      <ScrollReveal>
        <TrustBanner />
      </ScrollReveal>
    </main>
  );
};

export default Home;
