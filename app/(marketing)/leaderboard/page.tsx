import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/section";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import {
  leaderboardEntries,
  leaderboardStats,
} from "@/lib/leaderboard";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Stethoscope, Scale, Wrench, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "The SA AEO Index — South African Firms Ranked by AI Visibility",
  description:
    "Public monthly leaderboard of South African medical, legal, and industrial firms scored against The Real Estate Method. See where the leaders are — and where the gaps are. Updated monthly.",
  alternates: { canonical: `${site.url}/leaderboard` },
};

const sectorIcon = {
  medical: Stethoscope,
  legal: Scale,
  industrial: Wrench,
};

const sectorColor = {
  medical: "bg-rose-50 text-rose-700 border-rose-200",
  legal: "bg-amber-50 text-amber-700 border-amber-200",
  industrial: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function ScoreBar({ score }: { score: number }) {
  // Color band by score: low = rose, mid = amber, high = emerald
  const color =
    score < 25
      ? "bg-rose-500"
      : score < 40
        ? "bg-amber-500"
        : "bg-emerald-500";
  return (
    <div className="flex items-center gap-3">
      <div className="font-mono text-lg font-bold tabular-nums text-ink-900">
        {score}
      </div>
      <div className="h-2 w-16 flex-shrink-0 overflow-hidden rounded-full bg-ink-100 md:w-24">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "The SA AEO Index", href: "/leaderboard" },
        ])}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">The SA AEO Index · Beta</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            South African firms,
            <br />
            <span className="text-ink-500">ranked by AI visibility.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            The first public benchmark of SA medical, legal, and industrial
            firms scored against{" "}
            <Link
              href="/about"
              className="font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
            >
              The Real Estate Method
            </Link>
            . See where the leaders are. See where the gaps are. Updated
            monthly.
          </p>
        </div>

        {/* Beta disclosure — honest about state */}
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-ink-700">
          <strong className="text-ink-900">Beta state:</strong> The first 12
          entries are anonymised seeds illustrating the format. Real firms
          appear by name only with explicit written consent. First named
          entries publish Q3 2026. Want your firm assessed for inclusion?{" "}
          <Link
            href="/scan"
            className="font-medium text-accent-700 underline underline-offset-2 hover:text-accent-800"
          >
            Request a free scan →
          </Link>
        </div>

        {/* Quick stats */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 md:grid-cols-4">
          {[
            { label: "Firms indexed", value: leaderboardStats.totalEntries },
            { label: "Avg AEO score", value: leaderboardStats.averageScore },
            { label: "Top score", value: leaderboardStats.topScore },
            { label: "Bottom score", value: leaderboardStats.bottomScore },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-rule bg-white p-5 text-center shadow-soft"
            >
              <div className="text-3xl font-bold tracking-tight text-ink-900">
                {stat.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* The leaderboard */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-x-auto rounded-3xl border border-rule bg-white shadow-soft">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead>
                <tr className="bg-ink-50 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  <th className="px-4 py-4 text-center md:px-5">Rank</th>
                  <th className="px-4 py-4 md:px-5">Firm</th>
                  <th className="px-4 py-4 md:px-5">Sector</th>
                  <th className="px-4 py-4 md:px-5">AEO Score</th>
                  <th className="hidden px-4 py-4 md:table-cell md:px-5">
                    Top Strength
                  </th>
                  <th className="hidden px-4 py-4 md:table-cell md:px-5">
                    Biggest Gap
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardEntries.map((entry) => {
                  const Icon = sectorIcon[entry.sector];
                  return (
                    <tr
                      key={`${entry.rank}-${entry.name}`}
                      className="border-t border-rule align-top hover:bg-ink-50/40"
                    >
                      <td className="px-4 py-4 text-center md:px-5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 font-mono text-xs font-bold text-ink-700">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-5">
                        <div className="font-semibold text-ink-900">
                          {entry.name}
                          {entry.publicConsent && (
                            <span className="ml-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-ink-500">
                          {entry.city} · {entry.specialty}
                        </div>
                      </td>
                      <td className="px-4 py-4 md:px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${sectorColor[entry.sector]}`}
                        >
                          <Icon className="h-3 w-3" />
                          {entry.sector}
                        </span>
                      </td>
                      <td className="px-4 py-4 md:px-5">
                        <ScoreBar score={entry.score} />
                      </td>
                      <td className="hidden max-w-[260px] px-4 py-4 md:table-cell md:px-5">
                        <div className="text-xs text-ink-700 leading-snug">
                          {entry.topStrength}
                        </div>
                      </td>
                      <td className="hidden max-w-[260px] px-4 py-4 md:table-cell md:px-5">
                        <div className="text-xs leading-snug text-rose-700">
                          {entry.biggestGap}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs italic text-ink-500">
            Scoring methodology: 7 properties × weighted impact factors,
            normalised to 0-100. Methodology fully documented at{" "}
            <Link
              href="/about"
              className="font-medium text-accent-600 hover:text-accent-700"
            >
              kabelomore.com/about
            </Link>
            . Index updated monthly. Drift week 1 of every month.
          </p>
        </div>
      </Section>

      {/* CTA — get your firm assessed */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <div className="rounded-3xl bg-ink-gradient p-10 text-center text-white shadow-lift md:p-12">
          <h2 className="text-display-md font-semibold tracking-tight">
            Where would your firm rank?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink-300">
            Free AI Visibility Scan. 24-hour turnaround. PDF report. We&apos;ll
            tell you your AEO score, your top strength, and your biggest gap —
            same format as the index above.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/scan"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-base font-semibold text-ink-900 shadow-md transition-all duration-200 hover:bg-ink-50 hover:shadow-lift"
            >
              Get scored
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/resources"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/40 px-6 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/15"
            >
              See sector checklists
            </a>
          </div>
        </div>
      </Section>

      {/* Newsletter — index updates */}
      <Section variant="default" padding="default" containerSize="narrow">
        <NewsletterSignup variant="card" source="leaderboard" />
      </Section>
    </>
  );
}
