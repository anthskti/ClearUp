"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
          <p className="font-normal text-xl">ClearUp</p>
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
          <Link href="/profile" className="flex items-center">
            {/* Account Icon, find later */}
            My Account
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
