import type { NextConfig } from "next";

const IMAGE_DOMAIN =
  process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "d1flfk77wl2xk4.cloudfront.net";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true", // Only runs if ANALYZE=true
});

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/guides",
        destination: "/routines",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: false,
    deviceSizes: [640, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
      // Sephorea
      {
        protocol: "https",
        hostname: "www.sephora.com",
        pathname: "/productimages/sku/**",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
