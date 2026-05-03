"use client";

/**
 * MaskedEmail — renders a partially-masked email address with a
 * one-click reveal.
 *
 * Default render: `j****@example.com` (first char + tld preserved)
 * On click: full address shown + a `mailto:` link is wired up.
 *
 * Why mask by default:
 *   The admin dashboard displays prospect emails in plain view. Even
 *   though the route is auth-gated, masking is a simple defense
 *   against shoulder-surfing or screenshot leaks (sharing a screenshot
 *   of the inbox with someone who shouldn't see every prospect's
 *   contact details).
 *
 * Reveal is per-row: clicking one masked email doesn't unmask others.
 *
 * Edge cases handled:
 *   - Empty / undefined email → renders "—"
 *   - Email without "@" (malformed) → returns the raw string masked
 *   - Very short local part (1-2 chars) → preserves at least 1 char
 *     to keep the masking non-trivial
 */

import { useState } from "react";

interface Props {
  email: string | undefined | null;
}

export function MaskedEmail({ email }: Props) {
  const [revealed, setRevealed] = useState(false);

  if (!email || typeof email !== "string") {
    return <span className="text-[11px] text-ink-400">—</span>;
  }

  const masked = maskEmail(email);

  if (revealed) {
    return (
      <a
        href={`mailto:${email}`}
        className="text-[11px] text-accent-600 underline-offset-2 hover:underline"
      >
        {email}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="text-[11px] text-ink-500 hover:text-ink-700"
      title="Click to reveal full email"
    >
      {masked}
      <span className="ml-1 text-[9px] text-ink-400">(reveal)</span>
    </button>
  );
}

function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 1) {
    // No @ or @ at the very start — show first char + asterisks
    if (email.length <= 2) return "*".repeat(email.length);
    return email[0] + "*".repeat(Math.max(email.length - 1, 1));
  }
  const local = email.slice(0, at);
  const domain = email.slice(at);
  if (local.length === 1) return `${local}*${domain}`;
  if (local.length === 2) return `${local[0]}*${domain}`;
  return `${local[0]}${"*".repeat(Math.min(local.length - 1, 4))}${domain}`;
}
