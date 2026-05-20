import type { NextConfig } from "next";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
turbopack: {},
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
    ],
  },
};

export default withPWA(nextConfig);

