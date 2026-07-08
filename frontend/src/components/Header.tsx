"use client";

import Link from "next/link";
import ClearupLogoLink from "@/components/ClearupLogoLink";
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
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { broadcastSignOut } from "@/hooks/useCrossTabSignOut";
import { useEffectiveRole } from "@/hooks/useEffectiveRole";

const navItems = [
  // { name: "Home", href: "/" },
  { name: "Builder", href: "/builder" },
  { name: "Products", href: "/products" },
  { name: "Routines", href: "/routines" },
];

const productCategories = [
  { name: "Cleansers", href: "/products/category/cleanser" },
  { name: "Toners", href: "/products/category/toner" },
  { name: "Essences", href: "/products/category/essence" },
  { name: "Serums", href: "/products/category/serum" },
  { name: "Eye Care", href: "/products/category/eyecare" },
  { name: "Moisturizers", href: "/products/category/moisturizer" },
  { name: "Sunscreens", href: "/products/category/sunscreen" },
];

function Header() {
  const path = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const { isAdmin } = useEffectiveRole();

  useEffect(() => {
    const scrolling = () => {
      setIsScrolled(window.scrollY > 25);
    };
    scrolling();
    window.addEventListener("scroll", scrolling);
    return () => window.removeEventListener("scroll", scrolling);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
      if (
        productsDropdownRef.current &&
        !productsDropdownRef.current.contains(target)
      ) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setMobileProductsOpen(false);
    setIsProductsOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const handleSignOut = async () => {
    await authClient.signOut();
    broadcastSignOut();
    router.push("/");
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  const authButtonClass = `flex items-center text-black text-xs px-2 py-2 transition-colors duration-300 rounded-md border shrink-0 ${
    isScrolled
      ? "border-zinc-800 hover:bg-gray-200"
      : "border-zinc-800 hover:bg-gray-100/50"
  }`;

  return (
    <div className="fixed top-0 inset-x-0 z-20">
      {/* Frosted glass layer — separate from nav so blur spans full width */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-all duration-300 ${
          isScrolled
            ? "border-b border-black/5 bg-white/70 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
            : "bg-transparent"
        }`}
      />
      <nav className="relative z-10 container mx-auto flex items-center justify-between gap-3 px-4 py-4 md:grid md:grid-cols-3 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex shrink-0 items-center justify-center rounded-md p-2 text-zinc-800 hover:bg-zinc-200/80 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ClearupLogoLink priority />
        </div>

        <div className="hidden items-center justify-center space-x-10 text-xs font-semibold uppercase md:flex">
          {navItems.map((item) => {
            // Check if this item is the "Products" dropdown
            if (item.name === "Products") {
              return (
                <div
                  key={item.name}
                  className="relative"
                  ref={productsDropdownRef}
                >
                  <button
                    type="button"
                    onClick={() => setIsProductsOpen((open) => !open)}
                    aria-expanded={isProductsOpen}
                    aria-haspopup="true"
                    className={`flex items-center transition-colors text-xs uppercase ${
                      path.startsWith("/products")
                        ? "text-gray-700"
                        : "text-black hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        isProductsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* The Dropdown Menu (Hidden by default, shown on group-toggle) */}
                  <div
                    className={`absolute top-full left-1/2 z-10 mt-2 w-48 -translate-x-1/2 origin-top rounded-md border border-gray-100 bg-white shadow-lg transition-all duration-200 ${
                      isProductsOpen
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-95 opacity-0"
                    }`}
                  >
                    <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-t border-l border-gray-100 bg-white"></div>

                    <div className="relative overflow-hidden rounded-md bg-white py-2">
                      <Link
                        href="/products"
                        onClick={() => setIsProductsOpen(false)}
                        className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
                      >
                        All Products
                      </Link>
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={() => setIsProductsOpen(false)}
                          className="block px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
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
                    ? "text-gray-700"
                    : "text-black hover:text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end">
          {!mounted || isPending ? (
            <div className="h-[34px] w-[72px] shrink-0 animate-pulse rounded-md border border-transparent bg-gray-200 sm:w-[84px]"></div>
          ) : session ? (
            <div className="relative group" ref={profileDropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`${authButtonClass} max-w-[9rem] truncate sm:max-w-none`}
              >
                <span className="truncate">hi {session.user.name}!</span>
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
            <Link href="/login" className={authButtonClass}>
              <UserIcon className="h-4 w-4 shrink-0 pr-1" />
              Log In
            </Link>
          )}
        </div>
      </nav>

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeMobileNav}
          aria-hidden
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-[min(300px,88vw)] flex-col bg-[#F8F8F8] shadow-xl transition-transform duration-300 ease-out md:hidden ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!mobileNavOpen}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Menu
          </span>
          <button
            type="button"
            onClick={closeMobileNav}
            className="rounded-md p-2 text-zinc-700 hover:bg-zinc-200"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              if (item.name === "Products") {
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setMobileProductsOpen((open) => !open)}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                        path.startsWith("/products")
                          ? "bg-zinc-200/80 text-zinc-900"
                          : "text-zinc-800 hover:bg-zinc-100"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          mobileProductsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileProductsOpen && (
                      <ul className="mt-1 space-y-0.5 border-l border-zinc-200 pl-3 ml-3">
                        <li>
                          <Link
                            href="/products"
                            onClick={closeMobileNav}
                            className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                          >
                            All Products
                          </Link>
                        </li>
                        {productCategories.map((category) => (
                          <li key={category.name}>
                            <Link
                              href={category.href}
                              onClick={closeMobileNav}
                              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
                            >
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={closeMobileNav}
                    className={`block rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide transition-colors ${
                      path === item.href
                        ? "bg-zinc-200/80 text-zinc-900"
                        : "text-zinc-800 hover:bg-zinc-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Header;
