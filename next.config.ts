import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable strict mode to avoid double rendering which can trigger hydration errors
  reactStrictMode: false,
  // Disable ESLint checking during build
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
