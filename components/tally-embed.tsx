"use client";

import { useEffect, useRef } from "react";

/**
 * Embeds a Tally form via iframe.
 *
 * Tally form URLs look like https://tally.so/r/abc123 — pass the trailing ID.
 * We use the official Tally embed script for auto-resizing (no fixed iframe height).
 */
export function TallyEmbed({
  formId,
  title,
}: {
  formId: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Tally's embed script once. It hooks into iframes with data-tally-src
    // attribute and auto-resizes them to fit content.
    const existing = document.querySelector(
      'script[src="https://tally.so/widgets/embed.js"]',
    );
    if (existing) {
      // Re-trigger on existing script
      // @ts-expect-error — Tally attaches to window.Tally
      window.Tally?.loadEmbeds?.();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-2xl border border-rule bg-white">
      <iframe
        data-tally-src={`https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
        loading="lazy"
        width="100%"
        height="600"
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        title={title}
        className="block w-full"
      />
    </div>
  );
}
