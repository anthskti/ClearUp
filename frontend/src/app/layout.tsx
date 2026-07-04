import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Red_Hat_Display, Edu_QLD_Beginner } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { cn } from "@/lib/utils";

const eduQldBeginner = Edu_QLD_Beginner({
  subsets: ['latin'],
  weight: ['400'], 
  variable: '--font-edu-qld',          
});

const redHat = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-red-hat-display",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clearup",
  description: "Your Skincare Organizer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", inter.variable, eduQldBeginner.variable, redHat.variable)}>
      <body className={`${redHat.className} antialiased min-full`}>
        <main className="flex flex-col min-h-screen bg-[#F8F8F8]">
          <div className="flex flex-col flex-1 text-black">{children}</div>
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
