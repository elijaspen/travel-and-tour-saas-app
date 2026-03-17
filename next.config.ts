import type { NextConfig } from "next"
import { join } from "path"

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(__dirname),
  images: {
    remotePatterns: [
      { hostname: "tjgiskidryllvyjannsq.supabase.co" },
      { hostname: "images.unsplash.com" }
    ],
  },
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
