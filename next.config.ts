import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The hero photograph is the first thing anyone arriving from Instagram
    // sees, so it gets a higher quality than the site default.
    qualities: [75, 88],
    // WebP only, deliberately. AVIF files are smaller, but encoding them is
    // far more memory-hungry: resizing the site's photos to AVIF for one page
    // load peaked at 864 MB, which crashes Render's 512 MB free instance and
    // takes every image on the site down with it. WebP is supported by every
    // current browser and encodes at a fraction of the cost.
    formats: ["image/webp"],
  },
};

export default nextConfig;
