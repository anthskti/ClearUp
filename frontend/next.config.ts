import type { NextConfig } from "next";

const IMAGE_DOMAIN =
  process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "d1flfk77wl2xk4.cloudfront.net";

const nextConfig = {
  images: {
    unoptimized: false, // Enable Next.js optimization
    remotePatterns: [
      // Generic Cloudfront
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
        pathname: "/**",
      },
      // Generic Shopify
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      // Generic Favicon
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons**",
      },
      // Specific
      // Yesstyle Cloudfront Domain
      {
        protocol: "https",
        hostname: "d1flfk77wl2xk4.cloudfront.net",
        pathname: "/Assets/**",
      },
      // Roundlab
      {
        protocol: "https",
        hostname: "roundlab.com",
        pathname: "/cdn/shop/files/**",
      },
      // SKIN1004
      {
        protocol: "https",
        hostname: "www.skin1004.com",
        pathname: "/**",
      },
      // Anua
      {
        protocol: "https",
        hostname: "anua.com",
        pathname: "/cdn/shop/files/**",
      },
      // Anua
      {
        protocol: "https",
        hostname: "theordinary.com",
        pathname: "/dw/image/**",
      },
      // COSRX
      {
        protocol: "https",
        hostname: "www.cosrx.com",
        pathname: "/cdn/shop/files/**",
      },
      // Haisue/Shiedo
      {
        protocol: "https",
        hostname: "haisue.ca",
        pathname: "/**",
      },
      // Cetaphil
      {
        protocol: "https",
        hostname: "www.cetaphil.ca",
        pathname: "/dw/image/**",
      },
      // CosDeBaha
      {
        protocol: "https",
        hostname: "cosdebahaofficial.com",
        pathname: "/cdn/shop/files/**",
      },
    ],
  },
};

export default nextConfig;
