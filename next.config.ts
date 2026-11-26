import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets `npm run share` serve the dev server through a public tunnel URL.
  allowedDevOrigins: ["*.trycloudflare.com"],
};

export default nextConfig;
