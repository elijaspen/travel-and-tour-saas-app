import type { NextConfig } from "next"
import { join } from "path"

const isDev = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(__dirname),
  images: {
    // Next.js 16+ blocks optimizng images that resolve to private IPs (SSRF).
    // Local Supabase storage uses 127.0.0.1 — allow only in dev.
    dangerouslyAllowLocalIP: isDev,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "54321",
        pathname: "/storage/v1/**",
      },
      { hostname: "tjgiskidryllvyjannsq.supabase.co" },
      { hostname: "images.unsplash.com" }
    ],
  },
}

export default nextConfig

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
