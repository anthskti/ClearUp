import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";
import Matches from "@/components/home/Matches";
import TrendingBuilds from "@/components/home/TrendingBuilds";
import HowItWorks from "@/components/home/HowItWorks";

const Home = () => {
  return (
    <main className="bg-white min-h-screen">
      <HeroSection />
      <TrendingBuilds />
      <Matches />
      <HowItWorks />
    </main>
  );
};

export default Home;
