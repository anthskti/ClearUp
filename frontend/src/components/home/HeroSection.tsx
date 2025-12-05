import Image from "next/image";

const HeroSection = () => {
  return (
    <div className="relative w-full">
      <Image
        src="assets/home.jpg"
        alt="Home Background"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
};

export default HeroSection;
