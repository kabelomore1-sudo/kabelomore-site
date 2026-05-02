/**
 * Visual Pillars — replaces the text-heavy "What's broken" trio with
 * three visual demonstrations.
 *
 * Pillar 1: SCHEMA — show what AI engines see (raw HTML soup) vs what
 *           they need (clean structured JSON-LD)
 * Pillar 2: CITATIONS — show a network/list of where competitors are
 *           cited and where the user isn't
 * Pillar 3: CONTENT — side-by-side: brochure copy vs answer-shaped Q&A
 *
 * Pure CSS/HTML — no external images. Mobile-first.
 */

import { Section, Eyebrow } from "./ui/section";
import { CheckCircle2, XCircle, Code2, MapPin, FileText } from "lucide-react";

export function VisualPillars() {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="justify-center">Why AI doesn&apos;t recommend you</Eyebrow>
        <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
          Three things AI engines look for.
          <br />
          <span className="text-ink-500">Most websites have none of them.</span>
        </h2>
      </div>

      {/* Pillar 1 — Schema markup */}
      <div className="mx-auto mt-16 max-w-5xl">
        <PillarHeader
          number="01"
          icon={Code2}
          title="Your website is missing the right code for AI to read it"
          subtitle="AI engines don't read websites the way humans do. They look for structured tags that say 'this is a business, here's what it does, here's where it's based.' Most SA websites don't have these tags — so AI has to guess, and usually doesn't recommend you."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {/* Without schema */}
          <ComparisonCard variant="bad" label="Most websites">
            <div className="space-y-2 text-[11px] font-mono">
              <div className="text-rose-700">
                {"<h1>Welcome to OMS Lifting</h1>"}
              </div>
              <div className="text-zinc-500">
                {"<p>South Africa's premier lifting"}
                <br />
                {"   solutions partner with over"}
                <br />
                {"   18 years of experience...</p>"}
              </div>
              <div className="text-zinc-400">{"<!-- no schema markup -->"}</div>
              <div className="mt-4 rounded bg-rose-50 p-3 text-rose-800">
                <strong>What AI sees:</strong> &ldquo;some text about
                lifting&rdquo; — no idea what kind of business this is, where
                it&apos;s based, or whether to recommend it.
              </div>
            </div>
          </ComparisonCard>

          {/* With schema */}
          <ComparisonCard variant="good" label="What AI engines need">
            <div className="space-y-2 text-[11px] font-mono">
              <div className="text-emerald-700">
                {`{`}
                <br />
                {`  "@type": "LocalBusiness",`}
                <br />
                {`  "name": "OMS Lifting Solutions",`}
                <br />
                {`  "address": {`}
                <br />
                {`    "city": "Pretoria",`}
                <br />
                {`    "country": "ZA"`}
                <br />
                {`  },`}
                <br />
                {`  "areaServed": ["Gauteng", "NW"]`}
                <br />
                {`}`}
              </div>
              <div className="mt-4 rounded bg-emerald-50 p-3 text-emerald-800">
                <strong>What AI sees:</strong> a verified Pretoria-based
                lifting business serving Gauteng + North West, with confidence
                to recommend.
              </div>
            </div>
          </ComparisonCard>
        </div>
      </div>

      {/* Pillar 2 — Citations */}
      <div className="mx-auto mt-20 max-w-5xl">
        <PillarHeader
          number="02"
          icon={MapPin}
          title="Trusted directories don't list you (HelloPeter, Brabys, sector-specific)"
          subtitle="AI engines verify businesses by checking if trusted SA sites mention them. HelloPeter, Brabys, HPCSA, LSSA, BBBEE Verification, industry directories — the more places confirm you exist, the more AI trusts you and recommends you."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ComparisonCard variant="bad" label="Your business right now">
            <div className="text-sm text-ink-700">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-rose-700">
                Citation count: 0-3 sites
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <CitationRow label="brabys.com" present={false} />
                <CitationRow label="cylex.co.za" present={false} />
                <CitationRow label="hellopeter.com" present={false} />
                <CitationRow label="b2bhint.com" present={false} />
                <CitationRow label="industry directories" present={false} />
                <CitationRow label="Google Business Profile" present={false} />
              </div>
              <div className="mt-4 rounded bg-rose-50 p-3 text-xs text-rose-800">
                <strong>AI verdict:</strong> &ldquo;This business may exist but
                I have no third-party confirmation. I won&apos;t risk
                recommending it.&rdquo;
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard variant="good" label="Your competitor (recommended by AI)">
            <div className="text-sm text-ink-700">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Citation count: 25-50 sites
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <CitationRow label="brabys.com" present={true} />
                <CitationRow label="cylex.co.za" present={true} />
                <CitationRow label="hellopeter.com" present={true} />
                <CitationRow label="b2bhint.com" present={true} />
                <CitationRow label="LME register (DoL)" present={true} />
                <CitationRow label="Google Business Profile" present={true} />
                <CitationRow label="industry magazines" present={true} />
                <CitationRow label="+ 18 more sources" present={true} muted />
              </div>
              <div className="mt-4 rounded bg-emerald-50 p-3 text-xs text-emerald-800">
                <strong>AI verdict:</strong> &ldquo;This business is verified
                across multiple trusted sources. Recommending with
                confidence.&rdquo;
              </div>
            </div>
          </ComparisonCard>
        </div>
      </div>

      {/* Pillar 3 — Content shape */}
      <div className="mx-auto mt-20 max-w-5xl">
        <PillarHeader
          number="03"
          icon={FileText}
          title="Your content doesn't answer the questions customers actually ask"
          subtitle="AI pulls direct quotes from websites when answering customer questions. Marketing copy ('we are a leading provider of...') can't be quoted. Real answers to real questions ('how often must crane chains be inspected?') get pulled into AI answers as authoritative sources."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ComparisonCard variant="bad" label="Brochure copy (most websites)">
            <div className="space-y-3 text-sm">
              <div className="rounded bg-zinc-50 p-3 text-ink-700 leading-relaxed">
                &ldquo;Welcome to OMS Lifting Solutions. We are a leading
                BBBEE Level 1 industrial supplier in Pretoria with over 18
                years of excellence in delivering world-class lifting
                solutions...&rdquo;
              </div>
              <div className="rounded bg-rose-50 p-3 text-xs text-rose-800">
                <strong>AI can&apos;t quote this.</strong> No specific
                question answered. No concrete fact to extract. Marketing
                fluff is invisible to AI.
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard variant="good" label="Answer-shaped (AI-readable)">
            <div className="space-y-3 text-sm">
              <div className="rounded bg-zinc-50 p-3 text-ink-700">
                <div className="font-semibold text-ink-900">
                  How often must crane chains be inspected in South Africa?
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed">
                  Per the OHS Act DMR 18 regulations, crane chains used for
                  lifting must be inspected at least every 12 months by an
                  ECSA-registered LMI...
                </p>
              </div>
              <div className="rounded bg-emerald-50 p-3 text-xs text-emerald-800">
                <strong>AI quotes this directly.</strong> Specific question.
                Concrete answer. Authoritative source. AI engines pull this
                paragraph straight into customer answers.
              </div>
            </div>
          </ComparisonCard>
        </div>
      </div>
    </Section>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function PillarHeader({
  number,
  icon: Icon,
  title,
  subtitle,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
      <div className="flex flex-shrink-0 items-center gap-3">
        <span className="font-mono text-sm text-accent-600">{number}</span>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold tracking-tight text-ink-900">
          {title}
        </h3>
        <p className="mt-2 text-base text-ink-700 leading-relaxed">{subtitle}</p>
      </div>
    </div>
  );
}

function ComparisonCard({
  variant,
  label,
  children,
}: {
  variant: "good" | "bad";
  label: string;
  children: React.ReactNode;
}) {
  const isGood = variant === "good";
  return (
    <div
      className={`rounded-2xl border-2 p-5 shadow-soft transition-shadow hover:shadow-card ${
        isGood ? "border-emerald-200 bg-white" : "border-rose-200 bg-white"
      }`}
    >
      <div
        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] ${
          isGood ? "text-emerald-700" : "text-rose-700"
        }`}
      >
        {isGood ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        {label}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function CitationRow({
  label,
  present,
  muted,
}: {
  label: string;
  present: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        muted ? "text-ink-400" : "text-ink-700"
      }`}
    >
      {present ? (
        <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-600" />
      ) : (
        <XCircle className="h-3 w-3 flex-shrink-0 text-rose-500" />
      )}
      <span>{label}</span>
    </div>
  );
}
