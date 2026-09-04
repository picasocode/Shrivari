import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.shrivaarielectricals.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // HTML documents must always be revalidated at the CDN.
        // Fixes: Hostinger hcdn cached prerendered HTML for 1 year (Next.js
        // default s-maxage=31536000), so after a redeploy visitors served by a
        // stale edge node got old HTML referencing deleted /_next chunks
        // (404) and the client-rendered SPA stayed on the loading spinner.
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        // Fingerprinted build assets are immutable — keep long cache.
        // (Later rules override earlier ones for the same header key.)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Static site images: 1 day at the edge, serve stale while revalidating.
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
};

export default nextConfig;
