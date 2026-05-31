import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Security + AEO-friendly headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Canonical-host enforcement: 301 every www.kabelomore.com request to
  // the apex kabelomore.com. The canonical host is set in lib/site.ts
  // and is the apex; this redirect prevents www from serving content
  // independently — which (as of 2026-05-16) it was doing, with a
  // stale deployment that diverged from the apex deployment. Belt-and-
  // braces with whatever Vercel's Domains dashboard does: even if the
  // dashboard's primary-domain redirect breaks or is reconfigured, the
  // code-level rule below still enforces canonicalization.
  //
  // statusCode 301 (not Next's default `permanent: true` which emits
  // 308): 301 is what most search engines + the codebase's prior
  // documentation expect, and method-preservation (308's only edge
  // over 301) isn't relevant for static page navigation.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kabelomore.com" }],
        destination: "https://kabelomore.com/:path*",
        statusCode: 301,
      },
    ];
  },

  // Surface Vercel deployment metadata for the footer
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
