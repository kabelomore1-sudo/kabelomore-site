"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2, Send, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { INDUSTRIES, COUNTRIES } from "@/lib/types/scan";
import type { ScanResult } from "@/lib/types/scan";

type FormState =
  | { status: "idle" }
  | { status: "scanning"; stage: number }
  | { status: "success"; scanId: string; result: ScanResult }
  | { status: "error"; message: string; scanId?: string };

const inputClasses =
  "w-full rounded-xl border border-rule bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-300 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20";

const SCAN_STAGES = [
  { label: "Validating your business details", duration: 3000 },
  { label: "Searching for citations across the web", duration: 12000 },
  { label: "Testing how ChatGPT sees your category", duration: 12000 },
  { label: "Testing how Claude and Perplexity respond", duration: 12000 },
  { label: "Computing your AI visibility score", duration: 5000 },
  { label: "Generating your personalized diagnosis", duration: 4000 },
];

export function ScanForm({ defaultTier }: { defaultTier?: string }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });

  // Animate scan stages while we wait for the response
  useEffect(() => {
    if (state.status !== "scanning") return;
    let totalElapsed = 0;
    const timeouts: NodeJS.Timeout[] = [];
    SCAN_STAGES.forEach((stage, idx) => {
      const timeout = setTimeout(() => {
        setState((s) =>
          s.status === "scanning" ? { ...s, stage: idx + 1 } : s,
        );
      }, totalElapsed);
      timeouts.push(timeout);
      totalElapsed += stage.duration;
    });
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [state.status]);

  // On success, navigate to the results page (after stashing in sessionStorage)
  useEffect(() => {
    if (state.status !== "success") return;
    try {
      sessionStorage.setItem(
        `scan_${state.scanId}_result`,
        JSON.stringify(state.result),
      );
    } catch {
      // sessionStorage can be disabled (e.g. private browsing); not fatal
    }
    router.push(`/scan/${state.scanId}/results`);
  }, [state, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "scanning", stage: 0 });

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/scan/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setState({
          status: "error",
          message:
            data.message ??
            "Something went wrong. Please try again or email kabelo@kabelomore.com.",
          scanId: data.scanId,
        });
        return;
      }

      setState({
        status: "success",
        scanId: data.scanId,
        result: data.result,
      });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not submit. Please email kabelo@kabelomore.com directly.",
      });
    }
  }

  if (state.status === "scanning") {
    return <ScanningProgress stageIndex={state.stage} />;
  }

  if (state.status === "error") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 md:p-10">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-ink-900">
              Scan didn&apos;t complete cleanly
            </h2>
            <p className="mt-3 text-sm text-ink-700 leading-relaxed">
              {state.message}
            </p>
            <p className="mt-4 text-sm text-ink-700">
              We&apos;ve still notified Kabelo with your details — he&apos;ll
              follow up via email within 24 hours with your results manually.
            </p>
            <button
              type="button"
              onClick={() => setState({ status: "idle" })}
              className="mt-5 text-sm font-medium text-accent-700 hover:text-accent-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Idle / form view
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-ink-900">
            Business name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            placeholder="e.g. OMS Lifting Solutions"
            className={cn("mt-2", inputClasses)}
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-ink-900">
            Industry *
          </label>
          <select
            id="industry"
            name="industry"
            required
            defaultValue=""
            className={cn("mt-2", inputClasses)}
          >
            <option value="" disabled>
              Choose closest match
            </option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {industryLabel(ind)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-ink-900">
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            placeholder="e.g. Pretoria"
            className={cn("mt-2", inputClasses)}
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-ink-900">
            Country *
          </label>
          <select
            id="country"
            name="country"
            required
            defaultValue="ZA"
            className={cn("mt-2", inputClasses)}
          >
            <option value="ZA">South Africa</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="servicesText" className="block text-sm font-medium text-ink-900">
          Top 1-3 services your customers ask for *
        </label>
        <textarea
          id="servicesText"
          name="servicesText"
          rows={2}
          required
          placeholder="e.g. crane inspection, lifting equipment hire, BBBEE Level 1 industrial supplier"
          className={cn("mt-2", inputClasses, "resize-y")}
        />
        <p className="mt-1.5 text-xs text-ink-500">
          Use the words your customers actually use. Don&apos;t worry about SEO —
          this is what we test against AI engines.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-ink-900">
            Your name *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            required
            className={cn("mt-2", inputClasses)}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-900">
            Your email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={cn("mt-2", inputClasses)}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Optional fields — collapsed under disclosure */}
      <details className="group rounded-xl border border-rule bg-ink-50/40 p-4 open:bg-white open:shadow-soft">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-ink-900">
          <span>Optional — add more for a more accurate scan</span>
          <span className="text-xs text-ink-500 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="website" className="block text-xs font-medium text-ink-900">
                Website (if any)
              </label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="https://"
                className={cn("mt-1.5", inputClasses)}
                autoComplete="url"
              />
            </div>
            <div>
              <label htmlFor="gbpUrl" className="block text-xs font-medium text-ink-900">
                Google Business Profile URL
              </label>
              <input
                type="url"
                id="gbpUrl"
                name="gbpUrl"
                placeholder="https://maps.app.goo.gl/..."
                className={cn("mt-1.5", inputClasses)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-xs font-medium text-ink-900">
                Business phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+27 ..."
                className={cn("mt-1.5", inputClasses)}
              />
            </div>
            <div>
              <label htmlFor="linkedinUrl" className="block text-xs font-medium text-ink-900">
                LinkedIn page URL
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                placeholder="https://linkedin.com/company/..."
                className={cn("mt-1.5", inputClasses)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="facebookUrl" className="block text-xs font-medium text-ink-900">
                Facebook page URL
              </label>
              <input
                type="url"
                id="facebookUrl"
                name="facebookUrl"
                placeholder="https://facebook.com/..."
                className={cn("mt-1.5", inputClasses)}
              />
            </div>
            <div>
              <label htmlFor="instagramUrl" className="block text-xs font-medium text-ink-900">
                Instagram page URL
              </label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                placeholder="https://instagram.com/..."
                className={cn("mt-1.5", inputClasses)}
              />
            </div>
          </div>
        </div>
      </details>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {defaultTier && <input type="hidden" name="tier" value={defaultTier} />}

      <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">
          Scan takes about 60 seconds. We email you the report. No card. No follow-up unless you want one.
        </p>
        <Button type="submit" variant="primary" size="lg">
          Start my free scan <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// ─── Scanning progress UI ────────────────────────────────────────
function ScanningProgress({ stageIndex }: { stageIndex: number }) {
  const totalStages = SCAN_STAGES.length;
  const safeIndex = Math.min(stageIndex, totalStages - 1);
  const progress = Math.min(((safeIndex + 1) / totalStages) * 100, 95);

  return (
    <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-12">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-600">
            Scanning across 4 AI engines
          </div>
          <div className="text-base text-ink-500">This takes ~60 seconds</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="h-2 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full bg-accent-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink-500">
          <span>Stage {safeIndex + 1} of {totalStages}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Stage list */}
      <ul className="mt-8 space-y-3">
        {SCAN_STAGES.map((stage, idx) => {
          const done = idx < safeIndex;
          const active = idx === safeIndex;
          return (
            <li
              key={stage.label}
              className={cn(
                "flex items-center gap-3 text-sm transition-opacity",
                idx > safeIndex && "opacity-40",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs",
                  done && "bg-emerald-500 text-white",
                  active && "bg-accent-500 text-white",
                  !done && !active && "border-2 border-ink-200",
                )}
              >
                {done ? "✓" : active ? <Loader2 className="h-3 w-3 animate-spin" /> : ""}
              </span>
              <span
                className={cn(
                  done && "text-ink-500 line-through",
                  active && "font-medium text-ink-900",
                  !done && !active && "text-ink-500",
                )}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-ink-400">
        Don&apos;t close this tab. Your results will appear here automatically when the scan finishes.
      </p>
    </div>
  );
}

// ─── Industry label helper ───────────────────────────────────────
function industryLabel(ind: (typeof INDUSTRIES)[number]): string {
  switch (ind) {
    case "industrial-supplier":
      return "Industrial supplier";
    case "professional-services":
      return "Professional services";
    case "medical":
      return "Medical practice";
    case "legal":
      return "Legal practice";
    case "construction":
      return "Construction";
    case "retail":
      return "Retail";
    case "hospitality":
      return "Hospitality";
    case "manufacturing":
      return "Manufacturing";
    case "automotive":
      return "Automotive";
    case "other":
      return "Other";
  }
}
