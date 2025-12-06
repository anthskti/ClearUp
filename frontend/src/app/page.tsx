import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <section className="py-20 bg-[#F8F8F8]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            Show your best self with your best skin.
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
