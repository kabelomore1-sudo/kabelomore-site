"use client";

/**
 * Microsoft Clarity loader (session replays + heatmaps + Copilot).
 *
 * Mounted once site-wide from the root layout, next to <GoogleAnalytics />.
 * Initialises Clarity ONLY when:
 *   1. `NEXT_PUBLIC_CLARITY_PROJECT_ID` is set at build time.
 *   2. The page being loaded is NOT under /admin/*.
 *   3. The URL does NOT contain `token=` in the query string.
 *
 * Why the guards (this is the senior part):
 *   - Admin pages (/admin/scans, etc.) display masked PII and the
 *     submission inbox. We never want them appearing in session
 *     replays viewable by anyone with Clarity dashboard access.
 *   - The admin login flow is `/admin/scans?token=<48-char-hex>` —
 *     the bootstrap URL literally carries the admin secret in the
 *     query string. A single Clarity recording of that URL would
 *     leak the admin token. We refuse to init for that page load.
 *     Belt-and-braces: ALSO enable URL/query masking in your Clarity
 *     dashboard (Settings → Masking) for defence in depth.
 *
 * Important caveat: Clarity is a SPA-aware tag — once initialised it
 * tracks subsequent in-app navigations within the same tab. So if you
 * load the public homepage and then SPA-navigate to /admin/scans, the
 * admin page WILL be recorded. The hard guard above only prevents
 * init when the FIRST page load is admin / contains the token. The
 * standard mitigation for the "later navigated into admin" case is
 * Clarity's dashboard-level path masking (apply to /admin/*).
 *
 * Cookie consent: this install runs in Clarity's default
 * no-consent-required mode (the project setting controls this). If
 * you later wire a consent banner, call:
 *   Clarity.consentV2({ ad_Storage: 'granted'|'denied', analytics_Storage: 'granted'|'denied' })
 * once the user makes a choice. Safe to leave for v1.
 *
 * Bundle impact: the package is dynamic-imported so it stays out of
 * the initial JS bundle and the server bundle entirely. ~few KB on
 * first interaction.
 */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Read at module load so the env-var check happens once, not per render.
// NEXT_PUBLIC_ prefix is required: the project ID must reach the browser
// bundle (Clarity is a client-side tag). The project ID is not a secret —
// it's an identifier, exactly like a GA4 measurement ID.
const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export function ClarityLoader() {
  const pathname = usePathname();

  useEffect(() => {
    if (!PROJECT_ID) return;
    if (typeof window === "undefined") return;

    // Guard 1: never init on admin paths.
    if (pathname && pathname.startsWith("/admin")) return;

    // Guard 2: never init when the bootstrap admin token is in the URL.
    // Checking window.location.search avoids depending on the searchParams
    // hook (which would force this component into a Suspense boundary).
    if (window.location.search.includes("token=")) return;

    // Dynamic import keeps Clarity out of the server bundle and out of
    // the initial client chunk. Fire-and-forget — analytics must never
    // throw into the user's render path.
    import("@microsoft/clarity")
      .then(({ default: Clarity }) => {
        try {
          Clarity.init(PROJECT_ID);
        } catch (err) {
          // Init can throw if called twice or in some edge browser states.
          // Swallow — analytics is best-effort, never user-visible.
          console.warn("[ClarityLoader] init failed:", err);
        }
      })
      .catch((err) => {
        console.warn("[ClarityLoader] dynamic import failed:", err);
      });

    // Empty deps: we want ONE init per page load. Pathname is used only
    // for the initial gate. SPA navigations after init are handled by
    // Clarity itself (and by dashboard-level path masking for /admin/*).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
