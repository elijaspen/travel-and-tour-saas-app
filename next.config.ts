import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  distDir: "dist",
  images: {
    remotePatterns: [{ hostname: "tjgiskidryllvyjannsq.supabase.co" }],
  },
}

export default nextConfig
