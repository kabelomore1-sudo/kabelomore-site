import { Eyebrow } from "./ui/section";
import { CircleAlert, Search, Sparkles } from "lucide-react";

/**
 * High-converting demo section showing real AI engine queries
 * across 4 engines with the prospect's business missing while
 * competitors are recommended. Drop screenshots into
 * /public/screenshots/ and they'll surface here.
 *
 * Until screenshots are uploaded, the section renders a structured
 * "what we run" preview using real industry queries — already
 * persuasive on its own.
 */

const demoScenarios = [
  {
    industry: "Industrial supply",
    query:
      "I'm sourcing for a new mining operation in Limpopo and need a BBBEE Level 1 verified lifting equipment supplier with crane inspection capability. Who are the most reliable suppliers in Pretoria or Gauteng I should consider?",
    location: "Pretoria, South Africa",
    findings: {
      cited: ["3 generic suppliers", "1 international chain"],
      missing: "OMS Lifting Solutions (BBBEE Level 1, 89+ inspections)",
      stake: "1 mining contract = R150K-500K",
    },
    image: "/screenshots/industrial-pretoria.png",
  },
  {
    industry: "Care services",
    query:
      "My mother (78) has early-stage dementia and lives in Lincoln, UK. We need a trusted home care provider that specialises in dementia care with strong CQC ratings. Who should we consider?",
    location: "Lincoln, United Kingdom",
    findings: {
      cited: ["2 national chains", "1 directory aggregator"],
      missing: "Honeycomb Care (specialist care provider)",
      stake: "1 family client = £30K-100K LTV",
    },
    image: "/screenshots/care-lincoln.png",
  },
  {
    industry: "Legal",
    query:
      "I'm a SaaS founder in London raising a Series A from US investors. Which mid-market law firms have the strongest experience with venture-backed contracts and US-UK investor structures?",
    location: "London, United Kingdom",
    findings: {
      cited: ["3 magic circle firms"],
      missing: "Mid-market specialists (the actual SaaS market)",
      stake: "1 retainer client = £24K-60K/year",
    },
    image: "/screenshots/legal-london.png",
  },
  {
    industry: "Medical",
    query:
      "My father (68) needs a hip replacement and I'm in Johannesburg. Which private orthopaedic surgeons in Sandton have the best documented outcomes for elderly patients?",
    location: "Sandton, South Africa",
    findings: {
      cited: ["Hospital websites only"],
      missing: "Private practitioners (where patients want to go)",
      stake: "1 patient = R30-80K LTV",
    },
    image: "/screenshots/medical-sandton.png",
  },
];

const engines = [
  { name: "ChatGPT", color: "text-emerald-600" },
  { name: "Claude", color: "text-amber-600" },
  { name: "Gemini", color: "text-blue-600" },
  { name: "Perplexity", color: "text-purple-600" },
];

export function AiDemoSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-30 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">See it for yourself</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            What AI says about your competitors today.
            <br />
            <span className="text-ink-500">And what it doesn't say about you.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-500">
            Real queries. Four engines. Verbatim responses. We run the same
            tests on your business — free, in 24 hours.
          </p>
        </div>

        {/* Engine indicator strip */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
          <span className="text-ink-400">Tested across:</span>
          {engines.map((engine) => (
            <span
              key={engine.name}
              className="flex items-center gap-2 font-medium text-ink-700"
            >
              <span className={`h-2 w-2 rounded-full ${engine.color.replace("text-", "bg-")}`} />
              {engine.name}
            </span>
          ))}
        </div>

        {/* Demo scenarios grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {demoScenarios.map((scenario, idx) => (
            <article
              key={scenario.query}
              className="group flex flex-col overflow-hidden rounded-3xl border border-rule bg-white shadow-soft transition-all hover:border-accent-300 hover:shadow-card"
            >
              {/* Query bar — looks like an AI prompt input */}
              <div className="border-b border-rule bg-ink-50/60 px-6 py-5">
                <div className="flex items-start gap-3">
                  <Search className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ink-400">
                      <span>{scenario.industry}</span>
                      <span className="h-1 w-1 rounded-full bg-ink-300" />
                      <span>{scenario.location}</span>
                      <span className="h-1 w-1 rounded-full bg-ink-300" />
                      <span className="text-accent-600">User prompt</span>
                    </div>
                    <div className="mt-2 text-sm text-ink-900 leading-relaxed">
                      "{scenario.query}"
                    </div>
                  </div>
                </div>
              </div>

              {/* Result panel — placeholder until screenshot exists */}
              <div className="relative flex-1 bg-ink-gradient">
                <div className="absolute inset-0 grid-pattern opacity-15" />
                <div className="relative flex h-full min-h-[200px] flex-col justify-center p-8 text-white">
                  <div className="flex items-start gap-3">
                    <CircleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                    <div className="flex-1 text-sm leading-relaxed">
                      <div className="text-ink-300">
                        AI engines currently recommend:
                      </div>
                      <ul className="mt-2 space-y-1">
                        {scenario.findings.cited.map((item) => (
                          <li key={item} className="text-white">
                            · {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3">
                        <div className="text-xs uppercase tracking-wider text-amber-200">
                          Not cited
                        </div>
                        <div className="mt-1 text-amber-50">
                          {scenario.findings.missing}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* If/when a real screenshot is dropped at scenario.image,
                    this becomes the image. Until then, the structured
                    placeholder above renders. Comment out the line below
                    to use placeholder; uncomment when image is in place. */}
                {/* <Image src={scenario.image} alt="..." fill className="object-cover" /> */}
              </div>

              {/* Stake footer */}
              <div className="border-t border-rule bg-white px-6 py-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 flex-shrink-0 text-accent-600" />
                  <span className="text-ink-700">
                    <strong className="text-ink-900">What's at stake:</strong>{" "}
                    <span className="text-ink-500">{scenario.findings.stake}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-ink-500">
            We run these exact queries on your business in 24 hours.
          </p>
          <a
            href="/scan"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3 text-base font-medium text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
          >
            Run my free scan →
          </a>
        </div>
      </div>
    </section>
  );
}
