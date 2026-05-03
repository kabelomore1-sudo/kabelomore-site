"use client";

/**
 * Error boundary for the /admin/* segment.
 *
 * Catches uncaught exceptions thrown during rendering of any admin
 * route and renders a generic, NON-LEAKY error page.
 *
 * Important: we never echo the raw error message to the browser — the
 * `error.message` could contain stack-trace fragments or KV connection
 * strings. We log the error server-side via Next.js's automatic
 * error reporting and show a generic message to the admin.
 *
 * If `error.digest` is present (production builds), we surface it as
 * a copy-pasteable correlation ID so Kabelo can grep Vercel logs.
 */

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: Props) {
  useEffect(() => {
    // Log the message client-side so it lands in browser console for
    // dev work, but don't render it.
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("[admin error boundary]", error);
    }
  }, [error]);

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-8 shadow-soft">
        <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
          500 — Server error
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">
          Something broke on the admin page.
        </h1>
        <p className="mt-3 text-sm text-ink-700 leading-relaxed">
          The error has been logged server-side. Try the button below to
          re-render. If it persists, check Vercel logs — most likely cause
          is a KV outage or env var misconfiguration.
        </p>
        {error.digest ? (
          <p className="mt-3 text-[10px] font-mono text-ink-500">
            Reference: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-full bg-ink-900 px-4 py-2 text-xs font-semibold text-white hover:bg-ink-800"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
