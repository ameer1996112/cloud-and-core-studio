import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cloud-core/shared"],
  // Allow LAN devices (tablet) to load dev resources when reaching the
  // dev server by IP. Without this, Next.js blocks the client JS bundle
  // in dev, the login form never hydrates, and sign-in falls back to a
  // plain GET that reloads /login with empty fields.
  allowedDevOrigins: ["192.168.0.25"],
};

export default nextConfig;
