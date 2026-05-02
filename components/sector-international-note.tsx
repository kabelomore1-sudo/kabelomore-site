"use client";

/**
 * SectorInternationalNote
 *
 * Honest disclosure at the top of each sector resource: this checklist
 * is SA-tuned (BBBEE, HPCSA, LSSA, CSD, HelloPeter etc.). UK and US
 * versions are coming Q1 2027.
 *
 * Strategic purpose: prevents an international reader from bouncing in
 * the first 30 seconds when they hit irrelevant SA-specific platforms.
 * Captures their email for the international list while honesty +
 * specificity build trust.
 *
 * UX: collapsed by default with a clear "international?" link, expands
 * to show a waitlist input. Reuses the newsletter capture API with
 * source = 'sector-{slug}-intl-waitlist' so we can later pull these
 * subscribers into a separate audience without rebuilding the form.
 */

import { useState } from "react";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react";

export function SectorInternationalNote({ sectorSlug }: { sectorSlug: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: `sector-${sectorSlug}-intl-waitlist`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <Globe className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-ink-700">
            <strong className="text-ink-900">Heads up — this checklist is SA-tuned.</strong>{" "}
            It references South African platforms (HelloPeter, BBBEE Verification,
            CSD, HPCSA, LSSA, etc.) that don&apos;t apply outside South Africa. The
            7-property structure works globally — but the specific platforms
            don&apos;t. UK and US versions ship Q1 2027.
          </p>

          {!open && status !== "success" && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline-offset-2 hover:underline"
            >
              UK or US-based? Get the international version when it ships →
            </button>
          )}

          {open && status !== "success" && (
            <form
              onSubmit={handleSubmit}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="you@yourfirm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                className="flex-1 rounded-full border border-amber-300 bg-white px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "submitting" || !email}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-amber-700 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-800 disabled:opacity-50"
              >
                {status === "submitting" ? "..." : "Notify me"}
                {status !== "submitting" && <ArrowRight className="h-3 w-3" />}
              </button>
            </form>
          )}

          {status === "success" && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              On the list. We&apos;ll email you when the international version ships.
            </div>
          )}

          {status === "error" && (
            <p className="mt-2 text-xs text-rose-600">
              Couldn&apos;t add to list. Try again?
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
