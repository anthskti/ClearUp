"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  UserIcon,
  ChevronDown,
  Settings,
  ListPlus,
  Bookmark,
  Shield,
  LogOut,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { broadcastSignOut } from "@/hooks/useCrossTabSignOut";
import { useEffectiveRole } from "@/hooks/useEffectiveRole";

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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const { isAdmin } = useEffectiveRole();

  useEffect(() => {
    const scrolling = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", scrolling);
    return () => window.removeEventListener("scroll", scrolling);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    broadcastSignOut();
    router.push("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-20 transition-all duration-300 ${
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
          {!mounted || isPending ? (
            <div className="w-[84px] h-[34px] bg-gray-200 animate-pulse rounded-md border border-transparent"></div>
          ) : session ? (
            <div className="relative group" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`text-black text-xs px-2 py-2 transition-colors duration-300 rounded-md border${
                  isScrolled
                    ? " border-zinc-400 hover:bg-zinc-200" // Scrolled
                    : " border-white hover:bg-zinc-100/50" // Unscrolled
                }`}
              >
                hi {session.user.name}!
              </button>
              {/* Profile Dropdown Menu */}
              <div
                className={`absolute right-0 top-full mt-2 w-56 
                  bg-white rounded-md shadow-lg border border-gray-200 
                  transition-all duration-200 transform 
                  origin-top-right z-10 overflow-hidden ${
                    isProfileOpen
                      ? "opacity-100 visible scale-100"
                      : "opacity-0 invisible scale-95"
                  }`}
              >
                <div className="px-3 py-2 border-b border-gray-100 flex flex-col gap-0.5 bg-gray-50/50">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {session.user.email}
                  </span>
                </div>
                <div className="py-1 border-b border-gray-100">
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                    >
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile/preferences"
                    className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2 text-gray-400" />
                    Preferences
                  </Link>
                  <Link
                    href="/profile/created-routines"
                    className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <ListPlus className="w-4 h-4 mr-2 text-gray-400" />
                    Created Routines
                  </Link>
                  <Link
                    href="/profile/saved-routines"
                    className="flex items-center px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <Bookmark className="w-4 h-4 mr-2 text-gray-400" />
                    Saved Routines
                  </Link>
                </div>
                {/* Sign Out */}
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-500" />
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className={`flex items-center text-black text-xs px-2 py-2 transition-colors duration-300 rounded-md border ${
                isScrolled
                  ? "border-gray-400 hover:bg-gray-200"
                  : "border-white hover:bg-gray-100/50"
              }`}
            >
              <UserIcon className="pr-1 w-4 h-4" />
              Log In
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;
