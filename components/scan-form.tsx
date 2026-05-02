"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Loader2, Send, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { INDUSTRIES, COUNTRIES } from "@/lib/types/scan";
import type { ScanResult } from "@/lib/types/scan";

type FormValues = {
  businessName?: string;
  industry?: string;
  city?: string;
  country?: string;
  servicesText?: string;
  contactName?: string;
  email?: string;
  website?: string;
  gbpUrl?: string;
  phone?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
};

type FormState =
  | { status: "idle" }
  | { status: "scanning"; stage: number }
  | { status: "success"; scanId: string; result: ScanResult }
  | { status: "error"; message: string; field?: string; values: FormValues };

const inputClasses =
  "w-full rounded-xl border border-rule bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-300 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20";

const SCAN_STAGES = [
  { label: "Validating your business details", duration: 3000 },
  { label: "Discovering your website and Google Business Profile", duration: 10000 },
  { label: "Searching for citations across the web", duration: 12000 },
  { label: "Testing how AI engines see your category", duration: 15000 },
  { label: "Computing your AI visibility score", duration: 5000 },
  { label: "Generating your personalized diagnosis", duration: 4000 },
];

// Map technical field names to human-friendly labels for error messages
const FIELD_LABELS: Record<string, string> = {
  businessName: "Business name",
  industry: "Industry",
  city: "City",
  country: "Country",
  servicesText: "Services",
  contactName: "Your name",
  email: "Your email",
  website: "Website",
  gbpUrl: "Google Business Profile URL",
};

function friendlyError(message: string, field?: string): string {
  const fieldLabel = field ? FIELD_LABELS[field] ?? field : null;
  if (message.includes("at least 1 character")) {
    return fieldLabel
      ? `${fieldLabel} cannot be empty`
      : "Please fill in all required fields";
  }
  if (message.includes("Invalid email")) return "Please enter a valid email address";
  if (message.includes("Invalid url")) {
    return fieldLabel
      ? `${fieldLabel} must be a full URL (e.g. https://yourbusiness.co.za)`
      : "Please enter a valid URL";
  }
  return fieldLabel ? `${fieldLabel}: ${message}` : message;
}

export function ScanForm({ defaultTier }: { defaultTier?: string }) {
  const router = useRouter();
  const [state, setState] = useState<FormState>({ status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  // Animate scan stages while we wait
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

  // On success, stash result in sessionStorage and navigate to results
  useEffect(() => {
    if (state.status !== "success") return;
    try {
      sessionStorage.setItem(
        `scan_${state.scanId}_result`,
        JSON.stringify(state.result),
      );
    } catch {}
    router.push(`/scan/${state.scanId}/results`);
  }, [state, router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: FormValues = Object.fromEntries(formData.entries());

    setState({ status: "scanning", stage: 0 });

    try {
      const res = await fetch("/api/scan/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      // CRITICAL: parse JSON defensively. If Vercel returns a plain-text
      // error page (e.g. on a true gateway timeout), JSON.parse throws
      // 'Unexpected token A...' and the user sees a confusing error.
      // Fall back to a friendly message that matches the API's manual-
      // fallback narrative so the user still has a clear next step.
      let data: {
        ok?: boolean;
        scanId?: string;
        result?: ScanResult;
        message?: string;
        field?: string;
        fallback?: string;
      };
      try {
        data = await res.json();
      } catch {
        // Plain-text or HTML response — likely a gateway-level timeout.
        // The API's own try/catch normally prevents this, but we belt-
        // and-brace at the client too.
        setState({
          status: "error",
          message:
            "We've received your details but the automated scan didn't finish in time. Kabelo will run it manually and email your report within 24 hours.",
          values,
        });
        return;
      }

      if (!res.ok || !data.ok) {
        setState({
          status: "error",
          message:
            data.message ??
            "Something went wrong. Please email kabelo@kabelomore.com directly.",
          field: data.field,
          values,
        });
        return;
      }

      // Scan completed inline — navigate to results page
      setState({
        status: "success",
        scanId: data.scanId!,
        result: data.result!,
      });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not submit. Please email kabelo@kabelomore.com directly.",
        values,
      });
    }
  }

  if (state.status === "scanning") {
    return <ScanningProgress stageIndex={state.stage} />;
  }

  // Form is rendered for both "idle" and "error" states. Field defaults
  // restore the user's previous input on error so they don't lose typing.
  const defaults: FormValues = state.status === "error" ? state.values : {};

  // Detect manual-fallback errors — these are NOT user input problems,
  // they're "the automated scan didn't finish but Kabelo will deliver
  // manually" cases. Show a positive green banner instead of amber.
  const isManualFallback =
    state.status === "error" &&
    /manually|24 hours|within 24h/i.test(state.message);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Manual-fallback banner — green, positive */}
      {state.status === "error" && isManualFallback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-900">
                Submission received — report on its way.
              </div>
              <div className="mt-1.5 text-xs text-ink-700">
                {friendlyError(state.message, state.field)}
              </div>
              <div className="mt-2 text-xs text-ink-600">
                Check your inbox for a confirmation email. Reply to it if you
                want to add anything before Kabelo runs your scan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard error banner — amber, "fix and resubmit" */}
      {state.status === "error" && !isManualFallback && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-ink-900">
                {friendlyError(state.message, state.field)}
              </div>
              <div className="mt-1.5 text-xs text-ink-700">
                Your input is preserved — fix the issue and submit again.
                We&apos;ve also notified Kabelo with your details (he&apos;ll
                follow up by email).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1 of 2 — progress indicator */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-ink-900" />
          <div className="h-1.5 w-8 rounded-full bg-ink-200" />
        </div>
        <span className="text-xs text-ink-400">Step 1 of 2 — Basic details</span>
      </div>

      {/* ─── Section 1: About your business ─── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          About your business
        </h3>
      </div>

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
            defaultValue={defaults.businessName}
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
            defaultValue={defaults.industry ?? ""}
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
            defaultValue={defaults.city}
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
            defaultValue={defaults.country ?? "ZA"}
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
          defaultValue={defaults.servicesText}
          placeholder="e.g. crane inspection, lifting equipment hire, BBBEE Level 1 industrial supplier"
          className={cn("mt-2", inputClasses, "resize-y")}
        />
        <p className="mt-1.5 text-xs text-ink-500">
          Use the words your customers actually use. We test against AI engines using these.
        </p>
      </div>

      {/* Step 2 of 2 — progress indicator */}
      <div className="mb-2 mt-6 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-ink-900" />
          <div className="h-1.5 w-8 rounded-full bg-ink-900" />
        </div>
        <span className="text-xs text-ink-400">Step 2 of 2 — Online presence</span>
      </div>

      {/* ─── Section 2: Online presence (now visible by default) ─── */}
      <div className="border-t border-rule pt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Your online presence
        </h3>
        <p className="mt-2 text-sm text-ink-700">
          Help us run a more accurate scan. Leave any field blank if you don&apos;t have it —
          we&apos;ll search for it automatically.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-ink-900">
            Website (if any)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            defaultValue={defaults.website}
            placeholder="https://"
            className={cn("mt-2", inputClasses)}
            autoComplete="url"
          />
          <p className="mt-1.5 text-xs text-ink-500">
            Don&apos;t have one yet? Leave blank.
          </p>
        </div>
        <div>
          <label htmlFor="gbpUrl" className="block text-sm font-medium text-ink-900">
            Google Business Profile URL
          </label>
          <input
            type="url"
            id="gbpUrl"
            name="gbpUrl"
            defaultValue={defaults.gbpUrl}
            placeholder="https://maps.app.goo.gl/..."
            className={cn("mt-2", inputClasses)}
          />
          <p className="mt-1.5 text-xs text-ink-500">
            Search your business on Google → click &ldquo;Share&rdquo; → copy link.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink-900">
          Business phone (optional but improves citation analysis)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={defaults.phone}
          placeholder="+27 ..."
          className={cn("mt-2", inputClasses)}
        />
      </div>

      {/* ─── Section 3: Social profiles (still hidden, less important) ─── */}
      <details
        className="group rounded-xl border border-rule bg-ink-50/40 p-4 open:bg-white open:shadow-soft"
        open={Boolean(
          defaults.linkedinUrl || defaults.facebookUrl || defaults.instagramUrl,
        )}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-ink-900">
          <span>Add social profiles (optional)</span>
          <span className="text-xs text-ink-500 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="linkedinUrl" className="block text-xs font-medium text-ink-900">
              LinkedIn page
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              defaultValue={defaults.linkedinUrl}
              placeholder="https://linkedin.com/company/..."
              className={cn("mt-1.5", inputClasses)}
            />
          </div>
          <div>
            <label htmlFor="facebookUrl" className="block text-xs font-medium text-ink-900">
              Facebook page
            </label>
            <input
              type="url"
              id="facebookUrl"
              name="facebookUrl"
              defaultValue={defaults.facebookUrl}
              placeholder="https://facebook.com/..."
              className={cn("mt-1.5", inputClasses)}
            />
          </div>
          <div>
            <label htmlFor="instagramUrl" className="block text-xs font-medium text-ink-900">
              Instagram
            </label>
            <input
              type="url"
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={defaults.instagramUrl}
              placeholder="https://instagram.com/..."
              className={cn("mt-1.5", inputClasses)}
            />
          </div>
        </div>
      </details>

      {/* ─── Section 4: How to reach you ─── */}
      <div className="border-t border-rule pt-6">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          How to send you the scan
        </h3>
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
            defaultValue={defaults.contactName}
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
            defaultValue={defaults.email}
            className={cn("mt-2", inputClasses)}
            autoComplete="email"
          />
        </div>
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {defaultTier && <input type="hidden" name="tier" value={defaultTier} />}

      <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">
          Scan takes ~60 seconds. We email you the report. No card. No follow-up unless you want one.
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
            Running your AI Visibility scan
          </div>
          <div className="text-base text-ink-500">~60 seconds total</div>
        </div>
      </div>

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
        Don&apos;t close this tab. Your results appear here automatically when the scan finishes.
      </p>
    </div>
  );
}

function industryLabel(ind: (typeof INDUSTRIES)[number]): string {
  switch (ind) {
    case "industrial-supplier": return "Industrial supplier";
    case "professional-services": return "Professional services";
    case "medical": return "Medical practice";
    case "legal": return "Legal practice";
    case "construction": return "Construction";
    case "retail": return "Retail";
    case "hospitality": return "Hospitality";
    case "manufacturing": return "Manufacturing";
    case "automotive": return "Automotive";
    case "other": return "Other";
  }
}
