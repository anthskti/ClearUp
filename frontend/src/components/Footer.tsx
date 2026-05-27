"use client";

import Link from "next/link";
import Image from "next/image";

function Footer() {
  return (
    // 1. Added overflow-hidden to prevent the blur from causing horizontal scrolling
    <footer className="relative bg-[#0e4983] text-white pt-15 pb-8 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1: Logo */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="-mt-8 shrink-0">
              <Image
                src="/assets/clearuplogo-white.png"
                alt="ClearUp"
                width={2048}
                height={663}
                priority
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="h-22px w-auto max-w-[220px] md:h-30px md:max-w-[250px]"
              />
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />

          {/* Links Section */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Group 1: Company */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-100">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-white">
                <li>
                  <Link href="/about-us">About Us</Link>
                </li>
                <li>
                  <Link href="/why-clearup">Why You'll Love ClearUp</Link>
                </li>
              </ul>
            </div>

            {/* Group 2: Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-100">
                Account
              </h4>
              <ul className="space-y-3 text-sm text-white">
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/products/category/other">View Products</Link>
                </li>
                <li>
                  <Link href="/guides">View Guides</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </div>

            {/* Group 3: Community */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-100">
                Community
              </h4>
              <ul className="space-y-3 text-sm text-white">
                <li>
                  <Link href="https://www.instagram.com/clearup.skin/">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Divider & Legal */}
        <div className="flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
          <p className="text-white text-xs">
            &copy; ClearUp {new Date().getFullYear()}
          </p>

          <div className="flex gap-6 text-xs text-white">
            <Link href="/privacy">Privacy Policy</Link>
            <span>|</span>
            <Link href="/tos">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
