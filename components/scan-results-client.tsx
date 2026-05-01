"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Section, Eyebrow } from "./ui/section";
import { Button } from "./ui/button";
import { whatsappLink, site } from "@/lib/site";
import {
  classificationLabel,
  classificationDescription,
} from "@/lib/engines/classification";
import { scoreLabel } from "@/lib/engines/scoring";
import type { ScanResult } from "@/lib/types/scan";
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Mail,
  MessageCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

type LoadState =
  | { status: "loading" }
  | { status: "loaded"; result: ScanResult }
  | { status: "not-found" }
  | { status: "scanning" }
  | { status: "failed"; error: string };

export function ScanResultsClient({ scanId }: { scanId: string }) {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    // 1. Try sessionStorage first (set by scan-form on success)
    try {
      const stored = sessionStorage.getItem(`scan_${scanId}_result`);
      if (stored) {
        const result = JSON.parse(stored) as ScanResult;
        setState({ status: "loaded", result });
        return;
      }
    } catch {
      // sessionStorage may be disabled — fall through to API fetch
    }

    // 2. Fall back to API (works only if KV is configured server-side)
    let cancelled = false;
    fetch(`/api/scan/${scanId}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) {
          setState({ status: "not-found" });
          return;
        }
        if (data.status === "complete" && data.result) {
          setState({ status: "loaded", result: data.result });
        } else if (data.status === "scanning") {
          setState({ status: "scanning" });
          // Poll every 3s while still scanning
          const interval = setInterval(async () => {
            const res = await fetch(`/api/scan/${scanId}/status`);
            const d = await res.json();
            if (d.ok && d.status === "complete" && d.result) {
              clearInterval(interval);
              setState({ status: "loaded", result: d.result });
            } else if (d.ok && d.status === "failed") {
              clearInterval(interval);
              setState({ status: "failed", error: d.error ?? "Scan failed" });
            }
          }, 3000);
        } else if (data.status === "failed") {
          setState({ status: "failed", error: data.error ?? "Scan failed" });
        } else {
          setState({ status: "not-found" });
        }
      })
      .catch(() => {
        if (!cancelled) setState({ status: "not-found" });
      });

    return () => {
      cancelled = true;
    };
  }, [scanId]);

  if (state.status === "loading" || state.status === "scanning") {
    return <LoadingView scanning={state.status === "scanning"} />;
  }

  if (state.status === "not-found") {
    return <NotFoundView />;
  }

  if (state.status === "failed") {
    return <FailedView error={state.error} />;
  }

  return <ResultsView result={state.result} />;
}

// ─── Main results view (the conversion engine) ──────────────────
function ResultsView({ result }: { result: ScanResult }) {
  const cited = result.visibilityChecks.filter((v) => v.businessAppears).length;
  const totalChecks = result.visibilityChecks.length;

  return (
    <>
      {/* Hero with score */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-4xl">
          <Eyebrow>Your AI Visibility Scan · {result.businessName}</Eyebrow>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Left: the big score */}
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-600">
                AI Visibility Score
              </div>
              <div className="mt-2 flex items-end gap-2">
                <span className="text-display-xl font-semibold tracking-tight text-ink-900">
                  {result.score}
                </span>
                <span className="mb-3 text-2xl text-ink-500">/100</span>
              </div>
              <div className="mt-3 inline-flex rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                {scoreLabel(result.score)}
              </div>

              {/* Layer breakdown */}
              <div className="mt-8 space-y-3">
                <LayerBar label="Presence (website + GBP)" value={result.layers.presence} max={25} />
                <LayerBar
                  label="Authority (citations) — DOMINANT"
                  value={result.layers.authority}
                  max={40}
                />
                <LayerBar label="Consistency (NAP across web)" value={result.layers.consistency} max={20} />
                <LayerBar label="Content (schema + structure)" value={result.layers.content} max={15} />
              </div>
            </div>

            {/* Right: classification + diagnosis */}
            <div>
              <div className="rounded-2xl border-2 border-accent-200 bg-accent-50/40 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
                  {classificationLabel(result.classification)}
                </div>
                <p className="mt-3 text-sm text-ink-700 leading-relaxed">
                  {classificationDescription(result.classification)}
                </p>
              </div>

              <div className="mt-6">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  Plain-English diagnosis
                </div>
                <p className="mt-3 text-base text-ink-900 leading-relaxed">
                  {result.diagnosisFull}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-white p-4">
                <div>
                  <div className="text-xs text-ink-500">Citations found</div>
                  <div className="mt-1 text-2xl font-semibold text-ink-900">
                    {result.detected.citationCount}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-ink-500">Cited in AI tests</div>
                  <div className="mt-1 text-2xl font-semibold text-ink-900">
                    {cited}/{totalChecks || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Top issues */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Top issues we found</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          What&apos;s blocking AI engines from recommending you.
        </h2>

        <div className="mt-10 space-y-4">
          {result.issues.slice(0, 5).map((issue, idx) => (
            <article
              key={issue.id}
              className="flex gap-4 rounded-2xl border border-rule bg-white p-6 shadow-soft"
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white ${
                  issue.severity === "critical"
                    ? "bg-red-600"
                    : issue.severity === "high"
                      ? "bg-amber-600"
                      : issue.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-ink-400"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-ink-500">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      issue.severity === "critical"
                        ? "bg-red-100 text-red-700"
                        : issue.severity === "high"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-ink-100 text-ink-600"
                    }`}
                  >
                    {issue.severity}
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-ink-900">
                  {issue.title}
                </h3>
                <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                  {issue.explanation}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* What AI says (the gut punch) */}
      {result.visibilityChecks.length > 0 && (
        <Section variant="tinted" padding="lg" containerSize="narrow">
          <Eyebrow>What AI actually says about your category</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            We tested live. Here&apos;s what AI is saying.
          </h2>

          <div className="mt-10 space-y-5">
            {result.visibilityChecks.map((check, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-rule bg-white p-6 shadow-soft"
              >
                <div className="text-xs font-mono text-accent-600">QUERY {idx + 1}</div>
                <p className="mt-2 text-base font-medium text-ink-900">
                  &ldquo;{check.query}&rdquo;
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-ink-50/40 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-ink-700">
                      {check.businessAppears ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          {result.businessName} cited
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          {result.businessName} NOT cited
                        </>
                      )}
                    </div>
                    {check.competitorsCited.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs uppercase tracking-wider text-ink-500">
                          AI recommended these instead:
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-ink-700">
                          {check.competitorsCited.slice(0, 5).map((c, i) => (
                            <li key={`${c}-${i}`} className="flex gap-2">
                              <span className="font-mono text-ink-400">{i + 1}.</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="rounded-xl bg-ink-50/40 p-4">
                    <div className="text-xs uppercase tracking-wider text-ink-500">
                      Verbatim — what AI said
                    </div>
                    <p className="mt-2 text-sm italic text-ink-700 leading-relaxed">
                      {check.verbatimExcerpt || "(no specific excerpt captured)"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recommendations + CTA */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>What to do about it</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Your prioritized fix list.
        </h2>
        <p className="mt-4 text-base text-ink-500">
          Ranked by impact ÷ effort. The first one is the highest leverage.
        </p>

        <div className="mt-10 space-y-4">
          {result.recommendations.map((rec) => (
            <article
              key={rec.rank}
              className="rounded-2xl border border-rule bg-white p-6 shadow-soft md:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 font-mono text-sm text-white">
                  {String(rec.rank).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold tracking-tight text-ink-900">
                    {rec.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                    {rec.explanation}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-emerald-700">
                      {rec.estimatedImpact} impact
                    </span>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 font-semibold uppercase tracking-wider text-ink-600">
                      {rec.estimatedEffort} effort
                    </span>
                    {rec.mapsToTier && (
                      <Link
                        href={
                          rec.mapsToTier === "foundation"
                            ? "/foundation"
                            : `/services#${rec.mapsToTier}`
                        }
                        className="text-accent-600 hover:text-accent-700"
                      >
                        See pricing →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Conversion CTA */}
      <Section variant="ink" padding="lg">
        <div className="mx-auto max-w-3xl text-center text-white">
          <Eyebrow className="text-accent-400 justify-center">Next step</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight">
            Want me to fix this?
          </h2>
          <p className="mt-5 text-lg text-ink-300 leading-relaxed">
            {result.diagnosisOneLiner}
          </p>
          <p className="mt-4 text-base text-ink-300">
            The fastest path: WhatsApp me. We&apos;ll spend 10 minutes
            walking through your scan together. No pressure, no card.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={whatsappLink(
                `Hi Kabelo — I just got my AI Visibility scan for ${result.businessName}. My score is ${result.score}/100. Want to talk about fixing it?`,
              )}
              variant="ink"
              size="lg"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Kabelo now
            </Button>
            <Button
              href={`mailto:${site.contact.email}?subject=AI%20Visibility%20Scan%20-%20${encodeURIComponent(result.businessName)}&body=Hi%20Kabelo%2C%0A%0AI%20just%20got%20my%20scan%20for%20${encodeURIComponent(result.businessName)}.%20Score%3A%20${result.score}%2F100.%0A%0AI%27d%20like%20to%20talk%20about%20%5Bnext%20step%5D.%0A%0AThanks%2C%0A${encodeURIComponent(result.contactName)}`}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              <Mail className="h-4 w-4" /> Reply by email
            </Button>
          </div>
          <p className="mt-8 text-xs text-ink-400">
            Scan ID: {result.id} · Completed in {(result.durationMs / 1000).toFixed(1)}s ·{" "}
            <span>You&apos;ll receive a copy via email shortly</span>
          </p>
        </div>
      </Section>

      {/* Trust footer */}
      <Section variant="default" padding="default" containerSize="narrow">
        <div className="grid gap-6 md:grid-cols-3 text-sm text-ink-500">
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <Clock className="h-4 w-4 text-accent-600" />
              Compounding window
            </div>
            <p className="mt-2">
              AEO citations compound for 6-24 months. The businesses that fix
              their AEO infrastructure in 2026 dominate their categories
              through 2027-28.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <ShieldCheck className="h-4 w-4 text-accent-600" />
              No surprises
            </div>
            <p className="mt-2">
              Every project is 50% deposit / 50% on delivery. If we don&apos;t
              deliver what was quoted, you don&apos;t pay the second half.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink-900">
              <TrendingUp className="h-4 w-4 text-accent-600" />
              Proof, not promises
            </div>
            <p className="mt-2">
              We can&apos;t guarantee specific outcomes from specific AI engines
              on specific dates. We can guarantee a disciplined process and
              measure before/after.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

// ─── Helper components ───────────────────────────────────────────
function LayerBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-ink-700">{label}</span>
        <span className="font-mono text-ink-500">
          {value}/{max}
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            pct >= 80
              ? "bg-emerald-500"
              : pct >= 50
                ? "bg-accent-500"
                : pct >= 25
                  ? "bg-amber-500"
                  : "bg-red-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function LoadingView({ scanning }: { scanning: boolean }) {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
          {scanning ? "Your scan is still running…" : "Loading your results…"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-500">
          {scanning
            ? "This page will update automatically when the scan finishes (~30-60s total)."
            : "Just a moment."}
        </p>
      </div>
    </Section>
  );
}

function NotFoundView() {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
          Your results were emailed to you.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-500">
          We don&apos;t hold scan results in browser storage permanently. Check
          your email — your full report is there. If you can&apos;t find it,
          email kabelo@kabelomore.com and Kabelo will resend it manually.
        </p>
        <div className="mt-8">
          <Button href="/scan" variant="primary" size="md">
            Run another scan <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Section>
  );
}

function FailedView({ error }: { error: string }) {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 md:p-12">
        <div className="flex items-start gap-4">
          <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight text-ink-900">
              Scan didn&apos;t complete cleanly
            </h2>
            <p className="mt-3 text-sm text-ink-700 leading-relaxed">{error}</p>
            <p className="mt-4 text-sm text-ink-700">
              Don&apos;t worry — Kabelo has been notified with your details.
              He&apos;ll deliver your scan manually within 24 hours via email.
            </p>
            <div className="mt-6 flex gap-3">
              <Button href="/scan" variant="primary" size="md">
                Try again
              </Button>
              <Button
                href={`mailto:${site.contact.email}?subject=Scan%20issue&body=Hi%20Kabelo%2C%0A%0AI%20got%20a%20scan%20error.%20Could%20you%20resend%20my%20results%20manually%3F`}
                variant="secondary"
                size="md"
              >
                Email Kabelo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
