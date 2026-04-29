import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/eis-toolkit",
  assetPrefix: "/eis-toolkit",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
