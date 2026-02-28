"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { UserIcon, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Builder", href: "/builder" },
  { name: "Products", href: "/products" },
  { name: "Guides", href: "/guides" },
];

const productCategories = [
  { name: "Cleansers", href: "/products/category/cleanser" },
  { name: "Toners", href: "/products/category/toner" },
  { name: "Essences", href: "/products/category/essence" },
  { name: "Serums", href: "/products/category/serum" },
  { name: "Moisturizers", href: "/products/category/moisturizer" },
  { name: "Sunscreens", href: "/products/category/sunscreen" },
];

function Header() {
  const path = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, isPending } = authClient.useSession();

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

        <div className="flex items-center justify-center space-x-6 text-xs uppercase">
          {navItems.map((item) => {
            // Check if this item is the "Products" dropdown
            if (item.name === "Products") {
              return (
                <div key={item.name} className="relative group ">
                  {/* The Trigger Button */}
                  <button
                    className={`flex items-center transition-colors text-xs uppercase ${
                      path.startsWith("/products") // Highlight if we are in any product page
                        ? "text-gray-700 font-medium"
                        : "text-black hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                    <ChevronDown className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>

                  {/* The Dropdown Menu (Hidden by default, shown on group-hover) */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top">
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-100"></div>

                    <div className="relative bg-white rounded-md overflow-hidden py-2">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            // Standard Links (Home, Builder, Guides)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors ${
                  path === item.href
                    ? "text-gray-700 font-medium"
                    : "text-black hover:text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Uncomment when login is ready */}

        <div className="flex item-center justify-end space-x-4">
          <button
            className={`text-black text-xs px-2 py-2 transition-colors duration-300 rounded-md border${
              isScrolled
                ? " border-gray-400 hover:bg-gray-200" // Scrolled
                : " border-white hover:bg-gray-100/50" // Unscrolled
            }`}
          >
            {session ? (
              <Link href="/profile" className="flex items-center">
                <UserIcon className="pr-1 w-4 h-4" />
                hi {session.user.name}
              </Link>
            ) : (
              <Link href="/login" className="flex items-center">
                <UserIcon className="pr-1 w-4 h-4" />
                Log In
              </Link>
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Header;
