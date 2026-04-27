import { Section, Eyebrow } from "./ui/section";
import { Check, X, ArrowRight } from "lucide-react";

/**
 * Comparison block — kills the unspoken objection that AEO is
 * "just SEO with a new acronym." Targets keyword "AEO vs SEO"
 * which is high-volume, low-competition.
 */

const rows = [
  {
    label: "What it ranks in",
    seo: "Google search results (blue links)",
    aeo: "ChatGPT, Claude, Gemini, Perplexity answers + Google AI Overviews",
  },
  {
    label: "Who decides what wins",
    seo: "Google's algorithm",
    aeo: "Multiple LLMs, each with different training and signals",
  },
  {
    label: "What signals matter most",
    seo: "Backlinks, content length, keywords",
    aeo: "Structured data, third-party citations, entity verification, Q&A content",
  },
  {
    label: "How users find businesses",
    seo: "Click → browse → compare → decide",
    aeo: "Ask AI → AI recommends 2-5 → user picks one",
  },
  {
    label: "Where most agencies stop",
    seo: "Optimise for Google only",
    aeo: "Optimise for the new generation of search behaviour",
  },
  {
    label: "Time to results",
    seo: "3-12 months typical",
    aeo: "30-90 days for measurable citation movement",
  },
  {
    label: "Crowded?",
    seo: "Brutally — every business has 'an SEO person'",
    aeo: "Almost no one has done this yet (especially in SA)",
  },
];

export function AeoVsSeo() {
  return (
    <Section variant="default" padding="lg">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow className="justify-center">AEO vs Traditional SEO</Eyebrow>
        <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
          "Isn't this just SEO with a new acronym?"
          <br />
          <span className="text-ink-500">No. Here's the difference.</span>
        </h2>
        <p className="mt-5 text-lg text-ink-500">
          SEO targets the page where Google shows blue links. AEO/GEO targets the
          conversational answers AI engines now give. Some signals overlap.
          Most don't.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-3xl border border-rule bg-white shadow-soft">
        {/* Header row */}
        <div className="grid grid-cols-3 border-b border-rule bg-ink-50/50">
          <div className="px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Dimension
            </div>
          </div>
          <div className="border-l border-rule px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Traditional SEO
            </div>
            <div className="mt-1 text-sm text-ink-500">What most agencies do</div>
          </div>
          <div className="border-l border-rule bg-accent-50/40 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">
              AEO / GEO
            </div>
            <div className="mt-1 text-sm text-ink-700">What we do</div>
          </div>
        </div>

        {/* Body rows */}
        {rows.map((row, idx) => (
          <div
            key={row.label}
            className={`grid grid-cols-3 ${idx !== rows.length - 1 ? "border-b border-rule" : ""}`}
          >
            <div className="flex items-start px-6 py-5">
              <div className="text-sm font-medium text-ink-900">{row.label}</div>
            </div>
            <div className="border-l border-rule px-6 py-5">
              <div className="flex items-start gap-2 text-sm text-ink-600">
                <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-300" />
                <span>{row.seo}</span>
              </div>
            </div>
            <div className="border-l border-rule bg-accent-50/40 px-6 py-5">
              <div className="flex items-start gap-2 text-sm text-ink-900">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-600" />
                <span>{row.aeo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 max-w-3xl text-center">
        <p className="text-base text-ink-500">
          The signals overlap (both reward authority and clean structure). But
          AEO weighs <strong className="text-ink-900">structured data,
          third-party citations, and answer-shaped content</strong> dramatically
          more heavily. Most SEO agencies haven't caught up. We've built our
          practice around it.
        </p>
        <a
          href="/process"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          See our 5-step AEO process <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}
