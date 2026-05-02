"use client";

/**
 * Tiny client-only wrapper that emits a 'services_view' (or similar)
 * tracking event on page mount. Drop into a server-rendered page where
 * client-side useEffect isn't available directly.
 *
 * Usage:
 *   <TrackPageView event="services_view" />
 */

import { useEffect } from "react";
import { track, type TrackEvent } from "@/lib/track";

export function TrackPageView({ event }: { event: TrackEvent }) {
  useEffect(() => {
    track(event);
  }, [event]);

  return null;
}
