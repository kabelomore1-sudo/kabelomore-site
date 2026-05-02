/**
 * Lightweight client-side event tracking.
 *
 * MVP behaviour: emits structured console.log events with a stable
 * shape. Browsers send these to the dev console and (in production)
 * they appear in any analytics overlay you wire up later.
 *
 * MIGRATION PATH:
 *   When you connect a real analytics tool (Vercel Analytics, PostHog,
 *   Plausible, GA4), swap the console.log call inside track() for the
 *   provider's call — every call site stays the same.
 *
 * EVENTS WE EMIT:
 *   - services_view              (page load on /services)
 *   - services_cta_click         { cta: 'get-matched' | 'view-packages' | 'package-card' }
 *   - discovery_started          (form first interaction)
 *   - discovery_completed        (successful submit)
 *   - recommendation_shown       { packageId, confidence, suggestHumanReview }
 *   - recommendation_accepted    { packageId } — clicked the package CTA
 *   - talk_to_kabelo_clicked     { source: 'recommendation' | 'services' | 'discovery-fallback' }
 *
 * SAFETY:
 *   - Never logs PII (email, business name, etc.)
 *   - Only logs categorical / metric data
 *   - No external network calls in MVP — fully passive
 */

export type TrackEvent =
  | "services_view"
  | "services_cta_click"
  | "discovery_started"
  | "discovery_completed"
  | "recommendation_shown"
  | "recommendation_accepted"
  | "talk_to_kabelo_clicked"
  | "package_card_view";

export type TrackPayload = Record<string, string | number | boolean | undefined>;

/**
 * Emit a tracking event. Safe to call from anywhere in client code.
 * No-ops gracefully on the server.
 */
export function track(event: TrackEvent, data?: TrackPayload): void {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  // Console log so you can verify events fire in dev tools
  // eslint-disable-next-line no-console
  console.log("[track]", payload);

  // Wire to a real analytics provider here when ready. Examples:
  //
  //   Vercel Analytics:
  //     import { track as vaTrack } from '@vercel/analytics';
  //     vaTrack(event, data);
  //
  //   PostHog:
  //     posthog.capture(event, data);
  //
  //   Plausible:
  //     window.plausible?.(event, { props: data });
}
