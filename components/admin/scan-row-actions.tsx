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
  const [sendingEmail, setSendingEmail] = useState(false);
  const [savingMeta, setSavingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local optimistic copy of meta — flips immediately on click, then
  // router.refresh() reconciles from server. If the POST fails, we
  // revert.
  const [localMeta, setLocalMeta] = useState<ScanMeta>(meta);

  async function runScan() {
    if (running) return;

    // Cost confirmation — every scan spends ~$0.30 on Anthropic API.
    // The button is a single tap with no visual cost cue, so misclicks
    // are easy. window.confirm() is intentionally low-tech: it works,
    // blocks the UI, and the message is the only thing the user has to
    // read. Single-admin tool, so a polished dialog is over-engineering.
    const proceed = window.confirm(
      "Trigger a paid scan?\n\n" +
        "This calls the Anthropic API (~$0.30) and takes 30-50 seconds.\n" +
        "Click OK to fire, Cancel to abort.",
    );
    if (!proceed) return;

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

  async function sendEmail() {
    if (sendingEmail) return;

    const proceed = window.confirm(
      "Send completion emails?\n\n" +
        "Will dispatch:\n" +
        "  · Client report email (HTML, with score + top fixes + report link)\n" +
        "  · Admin notification (operational detail to your inbox)\n\n" +
        "Free — uses existing scan data, no new API spend.\n" +
        "Click OK to send.",
    );
    if (!proceed) return;

    setSendingEmail(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/scans/${scanId}/send-email`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        clientEmailSent?: boolean;
        adminEmailSent?: boolean;
      };
      if (!res.ok || !data.ok) {
        setError(data.message ?? `HTTP ${res.status}`);
        return;
      }
      // Optimistically reflect Emailed badge if client email landed
      if (data.clientEmailSent) {
        setLocalMeta((m) => ({ ...m, emailed: true }));
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSendingEmail(false);
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
      {/* Primary: run / view / send-email */}
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

        {status === "complete" ? (
          <button
            onClick={sendEmail}
            disabled={sendingEmail}
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            title="Send the client + admin completion emails. Uses existing scan data, no new API spend."
          >
            {sendingEmail ? "Sending…" : "Send email"}
          </button>
        ) : null}

        <button
          onClick={runScan}
          // Only disable while THIS browser tab is actively firing.
          // We used to also disable when `status === "scanning"` to
          // prevent double-firing during a real scan, but the side
          // effect was that submissions made in manual mode (which
          // sets status="scanning" without ever running Anthropic)
          // stayed permanently locked. Status pill in the next column
          // already shows the "Scanning" state visually — re-stating
          // it on the button helped no one and blocked admins from
          // running stuck submissions.
          disabled={running}
          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
            status === "complete"
              ? "border border-rule bg-white text-ink-700 hover:bg-ink-50"
              : "bg-accent-600 text-white hover:bg-accent-700"
          } disabled:opacity-60`}
        >
          {running
            ? "Running…"
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
