import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClearUp",
  description: "Skincare Organizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} antialiased min-full`}>
        <main className="flex flex-col min-h-screen bg-[#F8F8F8]">
          <div className="flex flex-col flex-1 text-black">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
        <Analytics />
      </body>
    </html>
  );
}
