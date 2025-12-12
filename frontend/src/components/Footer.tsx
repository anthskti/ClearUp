"use client";

import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#0F4A82] text-white pt-15 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1: Newsletter (Takes up 4 columns) */}
          <div className="md:col-span-5 lg:col-span-4">
            <h3 className="text-lg font-bold mb-4 tracking-wide uppercase">
              Clear Up
            </h3>
            <p className="text-sm mb-6 leading-relaxed">
              Get exclusive updates on your favorite products.
            </p>

            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/15 border border-white/50 text-white placeholder-slate-400 text-sm rounded-l-md px-4 py-2 w-full focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="button"
                className="bg-white text-[#0f2845] font-bold text-sm px-5 py-2.5 rounded-r-md hover:bg-slate-200 transition-colors duration-200"
              >
                Join
              </button>
            </form>
          </div>

          <div className="hidden md:block md:col-span-1" />

          {/* Links Section */}
          <div className="md:col-span-6 lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Group 1: Company */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-200">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-white">
                <li>
                  <Link href="/">About Us</Link>
                </li>
                <li>
                  <Link href="/">Why You'll Love ClearUp</Link>
                </li>
              </ul>
            </div>

            {/* Group 2: Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-200">
                Account
              </h4>
              <ul className="space-y-3 text-sm text-white">
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/products">View Products</Link>
                </li>
                <li>
                  <Link href="/guides">View Guides</Link>
                </li>
                <li>
                  <Link href="/FAQ">FAQ</Link>
                </li>
              </ul>
            </div>

            {/* Group 3: Community */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-5 text-slate-200">
                Community
              </h4>
              <ul className="space-y-3 text-sm text-white">
                <li>
                  <Link href="/team">Team ClearUp</Link>
                </li>
                <li>
                  <Link href="/">Instagram</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section: Divider & Legal */}
        <div className="flex md:flex-row flex-col justify-between md:items-center items-start gap-2">
          <p className="text-white text-xs">
            &copy; Clear Up {new Date().getFullYear()}
          </p>

          <div className="flex gap-6 text-xs text-white show-menu-item-divider">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/TOS">Terms of Service</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
