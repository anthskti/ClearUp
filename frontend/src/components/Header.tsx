"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserIcon } from "lucide-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Builder", href: "/builder" },
  { name: "Products", href: "/products" },
  { name: "Guides", href: "/guides" },
];

function Header() {
  const path = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const scrolling = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", scrolling);
    return () => window.removeEventListener("scroll", scrolling);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#F8F8F8] shadow-md" : "bg-transparent"
      }`}
    >
      {/* <div className="w-full"> */}
      <nav className="container mx-auto py-4 grid grid-cols-3 items-center">
        <div className="flex items-center justify-start">
          {/* Add Icon or change next line to custom image*/}
          <p className="font-bold tracking-widest text-lg">CLEARUP</p>
        </div>

        <div className="flex items-center justify-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`transition-colors ${
                isScrolled
                  ? path === item.href // Scrolled; honestly i don't think it looks that great, but good feature to have.
                    ? "text-gray-700"
                    : "text-black hover:text-gray-700"
                  : path === item.href // Unscrolled
                  ? "text-gray-700"
                  : "text-black hover:text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex item-center justify-end space-x-4">
          <button
            className={`text-black text-xs px-2 py-2 transition-all duration-300 rounded-md border${
              isScrolled
                ? " border-gray-400 hover:bg-gray-200" // Scrolled
                : " border-white hover:bg-gray-100/50" // Unscrolled
            }`}
          >
            <Link href="/profile" className="flex items-center">
              <UserIcon className="ml-2 w-4 h-4" />
              Log In
            </Link>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
