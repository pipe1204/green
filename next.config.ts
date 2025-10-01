import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hfwmceseqiismuzqghdg.supabase.co",
      },
    ],
  },
};

export default nextConfig;
