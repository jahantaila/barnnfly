import type { NextConfig } from "next";

// Allow the survey to be embedded as an iframe in WordPress (or anywhere else).
// We explicitly opt out of X-Frame-Options and use a permissive CSP frame-ancestors.
// Tighten `frame-ancestors` to specific domains before going to prod if you want.
const EMBEDDABLE_PATHS = ["/embed", "/embed/:path*", "/embed.js"];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(embed|embed/.*|embed\\.js)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *;",
          },
          {
            // explicitly clear any default XFO so old browsers don't block it
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

// Expose for potential later introspection
export const embeddablePaths = EMBEDDABLE_PATHS;

export default nextConfig;
