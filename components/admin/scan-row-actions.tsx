"use client";

/**
 * ScanRowActions — action buttons for each row of the admin
 * submissions table.
 *
 * Three orthogonal action groups:
 *   1. Run / Re-run — POST /api/admin/scans/[id]/run (Anthropic call)
 *   2. View result  — link to /scan/[id]/results
 *   3. Workflow     — toggle handled / emailed flags via /meta endpoint
 *
 * All POSTs use HttpOnly cookie auth (sent automatically by the browser).
 * No token is read or written by JavaScript here — security boundary
 * stays server-side.
 *
 * Optimistic UI: workflow toggles flip locally on click, then router
 * refresh re-syncs from KV. If the POST fails, we surface an inline
 * error so the user knows the persisted state didn't change.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ScanMeta } from "@/lib/storage/scanStore";

interface Props {
  scanId: string;
  status: string;
  meta: ScanMeta;
}

export function ScanRowActions({ scanId, status, meta }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [running, setRunning] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local optimistic copy of meta — flips immediately on click, then
  // router.refresh() reconciles from server. If the POST fails, we
  // revert.
  const [localMeta, setLocalMeta] = useState<ScanMeta>(meta);

  async function runScan() {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/scans/${scanId}/run`, {
        method: "POST",
        // Cookie-only auth — explicitly omit credentials: 'omit' would
        // strip our HttpOnly cookie. Default 'same-origin' is correct.
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.message ?? `HTTP ${res.status}`);
        return;
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  async function patchMeta(patch: Partial<ScanMeta>) {
    if (savingMeta) return;
    const previous = localMeta;
    setLocalMeta({ ...localMeta, ...patch });
    setSavingMeta(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/scans/${scanId}/meta`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        meta?: ScanMeta;
      };
      if (!res.ok || !data.ok) {
        setLocalMeta(previous); // revert
        setError(data.message ?? `HTTP ${res.status}`);
        return;
      }
      if (data.meta) setLocalMeta(data.meta);
      startTransition(() => router.refresh());
    } catch (err) {
      setLocalMeta(previous);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingMeta(false);
    }
  }

  const handled = Boolean(localMeta.handled);
  const emailed = Boolean(localMeta.emailed);

  return (
    <div className="flex flex-col items-end gap-2">
      {/* Primary: run / view */}
      <div className="flex flex-wrap justify-end gap-1.5">
        {status === "complete" ? (
          <a
            href={`/scan/${scanId}/results`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink-900 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-ink-800"
          >
            View result
          </a>
        ) : null}

        <button
          onClick={runScan}
          disabled={running || status === "scanning"}
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            status === "complete"
              ? "border border-rule bg-white text-ink-700 hover:bg-ink-50"
              : "bg-accent-600 text-white hover:bg-accent-700"
          } disabled:opacity-60`}
        >
          {running
            ? "Running…"
            : status === "scanning"
              ? "In progress…"
              : status === "complete"
                ? "Re-run"
                : status === "failed"
                  ? "Re-run scan"
                  : "Run scan"}
        </button>
      </div>

      {/* Secondary: workflow toggles. Stay visible regardless of scan
          status so Kabelo can mark a fallback-only submission as
          handled/emailed without ever running the paid scan. */}
      <div className="flex flex-wrap justify-end gap-1.5">
        <button
          onClick={() => patchMeta({ handled: !handled })}
          disabled={savingMeta}
          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            handled
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-rule bg-white text-ink-700 hover:bg-ink-50"
          } disabled:opacity-60`}
          title={
            handled
              ? "Click to un-mark as handled"
              : "Mark as reviewed (admin checked the scan output)"
          }
        >
          {handled ? "✓ Handled" : "Mark handled"}
        </button>
        <button
          onClick={() => patchMeta({ emailed: !emailed })}
          disabled={savingMeta}
          className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
            emailed
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "border border-rule bg-white text-ink-700 hover:bg-ink-50"
          } disabled:opacity-60`}
          title={
            emailed
              ? "Click to un-mark as emailed"
              : "Mark as emailed (report has been sent to the prospect)"
          }
        >
          {emailed ? "✓ Emailed" : "Mark emailed"}
        </button>
      </div>

      {error && (
        <div
          className="max-w-[20rem] truncate text-right text-[10px] text-rose-600"
          title={error}
        >
          {error}
        </div>
      )}
    </div>
  );
}
