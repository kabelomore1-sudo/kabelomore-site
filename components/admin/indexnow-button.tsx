"use client";

/**
 * IndexNowButton — admin dashboard one-click "Ping IndexNow" action.
 *
 * Why this exists: kicking off IndexNow from curl/PowerShell on
 * Windows hits the well-known shell-quoting nightmare every time.
 * This button bypasses the shell entirely:
 *   - Uses the HttpOnly admin cookie that's already in the browser
 *     (no token to retype)
 *   - JSON payload is built in JS so no quote escaping
 *   - Result shows inline so no terminal output to interpret
 *
 * Operationally, this is the canonical way to ping IndexNow from now
 * on. The curl / PowerShell paths still work for automation, but for
 * day-to-day manual triggers, this is one click vs five minutes of
 * shell debugging.
 */

import { useState } from "react";

type SubmitResult = {
  ok?: boolean;
  status?: number;
  message?: string;
  urlCount?: number;
};

export function IndexNowButton() {
  const [pinging, setPinging] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);

  async function ping() {
    if (pinging) return;
    setPinging(true);
    setResult(null);
    try {
      const res = await fetch("/api/indexnow/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromSitemap: true }),
      });
      const data = (await res.json().catch(() => ({}))) as SubmitResult;
      setResult({ ...data, status: data.status ?? res.status });
    } catch (err) {
      setResult({
        ok: false,
        status: 0,
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setPinging(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <button
        type="button"
        onClick={ping}
        disabled={pinging}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-rule bg-white px-4 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-ink-50 disabled:opacity-60"
        title="Push all sitemap URLs to IndexNow (Bing, Yandex, etc). Uses your admin cookie — no token to type."
      >
        {pinging ? "Pinging…" : "Ping IndexNow"}
      </button>

      {result && (
        <div
          className={`max-w-[20rem] rounded-lg border px-3 py-2 text-[10px] leading-snug ${
            result.ok
              ? "border-emerald-200 bg-emerald-50/60 text-emerald-700"
              : "border-rose-200 bg-rose-50/60 text-rose-700"
          }`}
        >
          {result.ok ? (
            <>
              <strong>✓ Pushed {result.urlCount ?? "?"} URLs</strong>
              <div className="mt-0.5 text-ink-600">
                HTTP {result.status}. Check BWT → IndexNow → Insights.
              </div>
            </>
          ) : (
            <>
              <strong>✗ Failed (HTTP {result.status ?? "?"})</strong>
              <div className="mt-0.5 break-words text-ink-700">
                {result.message ?? "Unknown error"}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
