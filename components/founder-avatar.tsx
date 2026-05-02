"use client";

import { useState } from "react";

/**
 * FounderAvatar — Kabelo More's photo with KM monogram fallback.
 *
 * If /images/kabelo-more.jpg exists and loads, shows the photo.
 * If the file 404s (e.g., not yet uploaded), shows the KM gradient
 * monogram instead. No broken image icons.
 *
 * Used anywhere the founder face needs to appear:
 *  - Site header (small circular)
 *  - Homepage hero (medium)
 *  - About page hero (large)
 *  - Blog post bylines (small)
 *  - Scan results CTA (small, optional)
 *
 * TODO: UPLOAD_PHOTO — save Kabelo's headshot to:
 *   /public/images/kabelo-more.jpg (square, 1000x1000px ideal)
 * Once dropped in place, no code change needed — this component
 * automatically picks it up.
 */
export function FounderAvatar({
  size = 96,
  className = "",
  showRing = true,
}: {
  size?: number;
  className?: string;
  showRing?: boolean;
}) {
  const [errored, setErrored] = useState(false);

  const ringClass = showRing ? "ring-2 ring-white" : "";

  if (errored) {
    // Fallback: KM monogram on dark→amber gradient
    return (
      <span
        className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-soft ${ringClass} ${className}`}
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 45%, rgb(245 158 11) 130%)",
        }}
        aria-label="Kabelo More"
      >
        <span
          className="font-bold tracking-tight text-white"
          style={{ fontSize: Math.max(10, size * 0.3) }}
        >
          KM
        </span>
      </span>
    );
  }

  // Use plain <img> (not next/image) so we can handle 404 gracefully via onError.
  // Bundle cost is negligible at the small sizes we use.
  //
  // CRITICAL: object-position 50% 22% — focuses the circular crop on the FACE.
  // The photo is full-body so default centering would crop to torso/legs.
  // 22% from top puts the face roughly center of the visible circle.
  return (
    <img
      src="/images/kabelo-more.jpg"
      alt="Kabelo More — AI Visibility Consultant, Pretoria"
      width={size}
      height={size}
      className={`flex-shrink-0 rounded-full object-cover shadow-soft ${ringClass} ${className}`}
      style={{
        width: size,
        height: size,
        objectPosition: "50% 22%",
      }}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}

/**
 * FounderAvatarLandscape — wider rectangular crop for About page hero.
 * Falls back to a gradient panel with KM monogram if photo not present.
 */
export function FounderAvatarLandscape({
  className = "",
}: {
  className?: string;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-2xl shadow-lift ${className}`}
        style={{
          aspectRatio: "4 / 5",
          background:
            "linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 45%, rgb(245 158 11) 130%)",
        }}
        aria-label="Kabelo More"
      >
        <span className="text-6xl font-bold tracking-tight text-white">KM</span>
      </div>
    );
  }

  // For the About page hero — show face + upper torso + some context
  // (the world around him reads as "real, lived experience" not stock).
  // object-position 50% 18% keeps face high in the frame.
  return (
    <img
      src="/images/kabelo-more.jpg"
      alt="Kabelo More — AI Visibility Consultant, Pretoria"
      className={`rounded-2xl object-cover shadow-lift ${className}`}
      style={{
        aspectRatio: "4 / 5",
        objectPosition: "50% 18%",
      }}
      onError={() => setErrored(true)}
    />
  );
}
