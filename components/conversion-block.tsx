/**
 * Conversion Block — the decision-moment glue between "interesting
 * insight" (preview dashboard) and "client signs up" (real action).
 *
 * Renders below the PreviewDashboard in two contexts:
 *   1. After /scan submission (FallbackBanner)
 *   2. On /scan/preview (standalone marketing page)
 *
 * Four sections in order, each tight (Naval: simple outside):
 *   1. Revenue Impact       — connects invisibility to lost rands
 *   2. Local Signals        — explains GBP/reviews/citations gap
 *   3. What Happens Next    — 3-step process clarity
 *   4. Decision Block       — primary + secondary + tertiary CTAs
 *
 * The numbers are sector-aware (medical/legal/industrial) using
 * conservative typical customer values. Never overpromises — always
 * uses words like "could", "estimated", "typical".
 */

import Link from "next/link";
import {
  AlertTriangle,
  TrendingDown,
  MapPin,
  Star,
  ListChecks,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MessageCircle,
  Mail,
  Sparkles,
  Clock,
} from "lucide-react";

interface ConversionBlockProps {
  /** Industry from the form submission — used to tailor revenue numbers */
  industry?: string;
  /** Business name personalises some headlines */
  businessName?: string;
}

// Sector-typical customer values — conservative, used for "what you're
// losing" math. Numbers are realistic SA averages.
type SectorEcon = {
  label: string;
  typicalDealSize: number; // ZAR
  typicalDealLabel: string;
  // Realistic missed-inquiry-per-week range when invisible to AI
  inquiriesLostPerMonth: { low: number; high: number };
};

function getSectorEconomics(industry: string): SectorEcon {
  const ind = industry.toLowerCase();
  if (ind === "medical") {
    return {
      label: "medical practice",
      typicalDealSize: 18_000,
      typicalDealLabel: "R18,000",
      inquiriesLostPerMonth: { low: 3, high: 12 },
    };
  }
  if (ind === "legal") {
    return {
      label: "law firm",
      typicalDealSize: 45_000,
      typicalDealLabel: "R45,000",
      inquiriesLostPerMonth: { low: 2, high: 8 },
    };
  }
  if (ind === "industrial-supplier" || ind === "manufacturing" || ind === "construction" || ind === "automotive" || ind === "industrial") {
    return {
      label: "industrial business",
      typicalDealSize: 180_000,
      typicalDealLabel: "R180,000",
      inquiriesLostPerMonth: { low: 1, high: 4 },
    };
  }
  // default
  return {
    label: "business",
    typicalDealSize: 12_000,
    typicalDealLabel: "R12,000",
    inquiriesLostPerMonth: { low: 2, high: 8 },
  };
}

/**
 * Format ZAR to compact form: R250k, R1.2M, etc.
 */
function formatZARCompact(value: number): string {
  if (value >= 1_000_000) {
    return `R${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `R${Math.round(value / 1_000)}k`;
  }
  return `R${value}`;
}

export function ConversionBlock({ industry = "other", businessName = "your business" }: ConversionBlockProps) {
  const econ = getSectorEconomics(industry);
  // Conservative realistic estimate: 1-2 missed inquiries/month at low end,
  // 5% close rate (very conservative). At sector typical deal value.
  const conservativeAnnualLoss = Math.round(econ.inquiriesLostPerMonth.low * 12 * 0.05 * econ.typicalDealSize);
  const optimisticAnnualLoss = Math.round(econ.inquiriesLostPerMonth.high * 12 * 0.05 * econ.typicalDealSize);

  return (
    <div className="space-y-8">

      {/* ─────────────────────────────────────────────────────────
          SECTION 1: REVENUE IMPACT
          The 'so what' of low AI visibility — in rands.
          ───────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border-2 border-rose-200 bg-rose-50/30 p-6 shadow-soft md:p-10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">
              What invisibility costs
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
              When AI recommends competitors, those leads go to them.
            </h3>
            <p className="mt-4 text-base text-ink-700 leading-relaxed">
              For a typical SA {econ.label} with average customer value around{" "}
              <strong className="text-ink-900">{econ.typicalDealLabel}</strong>,
              even {econ.inquiriesLostPerMonth.low}-{econ.inquiriesLostPerMonth.high}{" "}
              missed inquiries per month adds up to:
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-rose-200 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Conservative estimate
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  {formatZARCompact(conservativeAnnualLoss)}
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  per year going to competitors
                </div>
              </div>
              <div className="rounded-2xl border-2 border-rose-300 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-700">
                  Realistic upper bound
                </div>
                <div className="mt-2 text-3xl font-bold text-ink-900">
                  {formatZARCompact(optimisticAnnualLoss)}
                </div>
                <div className="mt-1 text-xs text-ink-600">
                  per year if competitors are well-positioned
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs italic text-ink-600">
              Math: {econ.inquiriesLostPerMonth.low}-{econ.inquiriesLostPerMonth.high} missed inquiries/month × 12 × 5% close rate × {econ.typicalDealLabel} typical customer value. Conservative — most firms underestimate close rate from warm AI-driven leads.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 2: URGENCY — the gap compounds
          ───────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border-2 border-amber-300 bg-amber-50/50 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
          <div>
            <h4 className="text-base font-semibold text-ink-900 md:text-lg">
              This gap compounds — every month you wait, competitors widen the lead.
            </h4>
            <p className="mt-2 text-sm text-ink-700 leading-relaxed">
              AI engines weight RECENCY and CONSISTENCY. Competitors who fix this in 60 days build a 6-month lead by year-end — citations get older + more trusted, content compounds, AI training cycles bake in their authority. Catching up later costs 2-3× what fixing it now does.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 3: LOCAL VISIBILITY SIGNALS
          GBP + reviews + citations + NAP + directories — the local AI inputs.
          ───────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent-100 text-accent-700">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
              Local visibility signals
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
              AI engines build their answer from your local signals.
            </h3>
            <p className="mt-3 text-base text-ink-700 leading-relaxed">
              ChatGPT, Claude, Gemini and Perplexity don&apos;t just read your website. They cross-reference your{" "}
              <strong className="text-ink-900">Google Business Profile</strong>, your{" "}
              <strong className="text-ink-900">reviews across HelloPeter + Google</strong>, your{" "}
              <strong className="text-ink-900">trusted directory listings</strong>, and your{" "}
              <strong className="text-ink-900">NAP consistency</strong> (Name + Address + Phone identical everywhere).
            </p>
            <p className="mt-3 text-base font-semibold text-ink-900">
              Weak in any one of these = AI engines don&apos;t recommend you.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {[
            {
              icon: MapPin,
              name: "Google Business Profile",
              note: "Claimed, verified, fully populated, posting weekly",
            },
            {
              icon: Star,
              name: "Reviews",
              note: "25+ Google + HelloPeter, ≥4.5★, response rate ≥80%",
            },
            {
              icon: ListChecks,
              name: "Industry citations",
              note: "Sector-specific (HPCSA, LSSA, BBBEE, CSD) + general (Brabys, Cylex)",
            },
            {
              icon: AlertTriangle,
              name: "NAP consistency",
              note: "Name + Address + Phone identical on every listing",
            },
            {
              icon: Sparkles,
              name: "Schema markup",
              note: "AI-readable code on your website (LocalBusiness, Service, FAQ)",
            },
            {
              icon: CheckCircle2,
              name: "Active social signals",
              note: "LinkedIn (founder + company) posting + engagement",
            },
          ].map((signal) => {
            const Icon = signal.icon;
            return (
              <div
                key={signal.name}
                className="flex items-start gap-3 rounded-xl border border-rule bg-ink-50/40 p-4"
              >
                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-600" />
                <div>
                  <div className="text-sm font-semibold text-ink-900">
                    {signal.name}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-600">
                    {signal.note}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 4: WHAT HAPPENS NEXT
          Process clarity. Three steps. No mystery.
          ───────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-rule bg-ink-50/40 p-6 md:p-10">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          What happens next
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
          From "I want to fix this" to your first AI citations.
        </h3>

        <ol className="mt-8 space-y-5">
          {[
            {
              n: "01",
              title: "We review your scan + your business",
              detail: "Free 15-min walkthrough call (or async by email). We confirm what the scan revealed, ask a few targeted questions, and align on what 'success in 90 days' looks like for YOUR business.",
            },
            {
              n: "02",
              title: "We prioritise the highest-impact fixes first",
              detail: "Based on real audits of SA businesses (industrial, medical, legal), we know which fixes move AI engines fastest. Schema + GBP + key citations usually compound within 30-60 days.",
            },
            {
              n: "03",
              title: "We implement (or guide your team)",
              detail: "We deploy the work directly, or hand your team a step-by-step playbook. Status updates every 3 days. Re-scan at 30 days shows before/after data.",
            },
          ].map((step) => (
            <li key={step.n} className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-ink-900 font-mono text-xs font-bold text-white">
                {step.n}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-ink-900 md:text-lg">
                  {step.title}
                </h4>
                <p className="mt-1 text-sm text-ink-700 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 5: RISK REDUCTION — confidence without overpromising
          ───────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
          <div>
            <h4 className="text-base font-semibold text-ink-900 md:text-lg">
              We focus on high-impact fixes first — most likely to improve visibility within 30-60 days.
            </h4>
            <p className="mt-2 text-sm text-ink-700 leading-relaxed">
              Based on real audits of South African businesses across industrial, medical, and legal sectors. Not generic AI theory — patterns from actual implementations. We can&apos;t promise specific outcomes (no honest consultant can), but we can promise the methodology + the cadence + complete transparency about what&apos;s working.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          SECTION 6: DECISION BLOCK — the single clear decision moment
          ONE primary CTA + 2 secondary options. Naval-shape: one obvious next step.
          ───────────────────────────────────────────────────────── */}
      <section className="rounded-3xl bg-ink-gradient p-8 text-white shadow-lift md:p-12">
        <div className="text-center">
          <h2 className="text-display-md font-semibold tracking-tight text-white md:text-display-lg">
            Do you want to fix this?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-ink-300 md:text-lg">
            You&apos;ve seen what AI engines say (or don&apos;t say) about businesses like {businessName}. Here&apos;s what you can do right now.
          </p>
        </div>

        {/* PRIMARY CTA — dominant, white-on-dark for max contrast */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-ink-900 shadow-lift transition-all duration-200 hover:bg-ink-50 hover:shadow-card md:text-lg"
          >
            Start improving my AI visibility
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* SECONDARY + TERTIARY — outlined, smaller */}
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://wa.me/27760351084?text=Hi%20Kabelo%2C%20I%20just%20saw%20my%20AI%20visibility%20preview%20and%20want%20to%20book%20a%2015-min%20walkthrough."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Book a 15-min walkthrough
          </a>
          <a
            href="mailto:kabelo@kabelomore.com?subject=Send%20me%20the%20full%20AI%20Visibility%20report"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-ink-200 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Mail className="h-4 w-4" />
            Just send me the full report by email
          </a>
        </div>

        <p className="mt-6 text-center text-xs italic text-ink-400">
          Most prospects start with a 15-min walkthrough. If you&apos;re ready to get going, hit the primary button. Either way — your full report still arrives within 24 hours.
        </p>
      </section>
    </div>
  );
}
