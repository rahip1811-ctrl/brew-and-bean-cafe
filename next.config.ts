import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The hero photograph is the first thing anyone arriving from Instagram
    // sees, so it gets a higher quality than the site default.
    qualities: [75, 88],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
