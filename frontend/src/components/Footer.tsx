"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

const SUPPORT_EMAIL = "support.clearup@gmail.com";
const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("ClearUp — Question or concern")}`;

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Footer() {
  return (
    // 1. Added overflow-hidden to prevent the blur from causing horizontal scrolling
    <footer className="relative bg-[#0e4983] text-white pt-15 pb-8 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1: Logo */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex justify-center md:justify-start -mt-8 shrink-0">
              <Image
                src="/assets/clearuplogo-white.png"
                alt="Clearup"
                width={2048}
                height={663}
                priority
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="h-22px w-auto max-w-[220px] md:h-30px md:max-w-[250px]"
              />
            </div>
            <p className="mt-4 text-sm text-slate-200 md:text-center">
              Questions? Email{" "}
              <a
                href={SUPPORT_MAILTO}
                className="text-white underline hover:text-slate-100"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
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
                {/* <li>
                  <Link href="/contact">Contact Us</Link>
                </li> */}
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
                  <Link
                    href="https://www.instagram.com/clearup.skin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <InstagramIcon className="h-4 w-4 shrink-0" />
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
            &copy; Clearup {new Date().getFullYear()}
          </p>

          <div className="flex gap-6 text-xs text-white">
            <Link href="/privacy">Privacy Policy</Link>
            <div className="hidden md:block w-px h-4 bg-white" />
            <Link href="/tos">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
