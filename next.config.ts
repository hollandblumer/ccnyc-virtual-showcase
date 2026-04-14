import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",               <-- Disable for now
  // basePath: "/ccnyc-virtual-showcase", <-- Disable for now
  // assetPrefix: "/ccnyc-virtual-showcase/", <-- Disable for now
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
