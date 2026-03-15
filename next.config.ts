import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 1. Strict pattern matching for external domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**", // Be as specific as possible
      },
      // {
      //   protocol: "https",
      //   hostname: "your-cdn-provider.com",
      //   port: "",
      //   pathname: "/**",
      // },
    ],

    // 2. Enable modern, smaller image formats
    formats: ["image/avif", "image/webp"],

    // 3. Optional: Customize breakpoints for your specific design system
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
