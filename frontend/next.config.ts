import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["firebasestorage.googleapis.com"], //Allows firebase images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**", // Allows all paths under drive.google.com
      },
    ],
  },
  // env: {

  // }
};

export default nextConfig;
