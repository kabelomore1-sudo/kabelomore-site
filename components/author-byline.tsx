/**
 * AuthorByline
 *
 * Compact attribution component for resource pages, blog posts, and any
 * authored content. Communicates E-E-A-T (Experience / Expertise /
 * Authoritativeness / Trustworthiness) to AI engines + visual trust to
 * human readers.
 *
 * Renders: photo + name + title + credentials + optional published date.
 * Links to /about so curious readers can dig deeper before deciding to
 * book.
 *
 * Use at the top of any long-form authored page (above the fold) so
 * readers know who's behind the content before reading it.
 */

import Link from "next/link";
import { FounderAvatar } from "./founder-avatar";

export function AuthorByline({
  date,
  variant = "default",
}: {
  /** ISO 8601 date string. If omitted, no date shows. */
  date?: string;
  /** 'default' = photo + name + title + date; 'compact' = single-line */
  variant?: "default" | "compact";
}) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 text-sm">
        <FounderAvatar size={36} showRing={false} />
        <div>
          <Link
            href="/about"
            className="font-semibold text-ink-900 hover:text-accent-700"
          >
            Kabelo More
          </Link>
          {formattedDate && (
            <span className="ml-2 text-ink-500">· {formattedDate}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-rule bg-white p-4 shadow-soft md:p-5">
      <FounderAvatar size={56} showRing={false} />
      <div className="flex-1">
        <div className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-400">
          By the author
        </div>
        <Link
          href="/about"
          className="mt-1 block text-lg font-semibold text-ink-900 hover:text-accent-700"
        >
          Kabelo More
        </Link>
        <div className="mt-0.5 text-sm text-ink-600">
          AI Visibility Consultant · Pretoria · 8 years local SEO
        </div>
        {formattedDate && (
          <div className="mt-2 text-xs text-ink-500">
            Published {formattedDate} · Updates as methodology evolves
          </div>
        )}
      </div>
      <Link
        href="/about"
        className="hidden self-start text-xs font-medium text-accent-600 hover:text-accent-700 md:block"
      >
        About →
      </Link>
    </div>
  );
}
