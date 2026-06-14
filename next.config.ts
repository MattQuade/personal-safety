import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: ".next",
  webpack: (config, { isServer }) => {
    // TypeScript now automatically knows the exact types for config and isServer
    return config;
  },
};

export default nextConfig;