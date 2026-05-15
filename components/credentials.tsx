import { Award, GraduationCap, BookOpen } from "lucide-react";

const credentials = [
  {
    icon: Award,
    name: "Claude 101",
    issuer: "Anthropic",
    date: "May 2026",
    accent: "bg-amber-500/10 text-amber-600",
    // Verifiable: cert no. 95bmq8ftp6ed, completed 6 May 2026.
    // Mirrors the hasCredential entry in lib/seo.ts kabeloPersonJsonLd.
    description:
      "Anthropic-certified in Claude AI (cert. 95bmq8ftp6ed) — prompt engineering, tool use, and production deployment.",
  },
  {
    icon: GraduationCap,
    name: "Digital Marketing & E-Commerce",
    issuer: "Google",
    date: "2024",
    accent: "bg-blue-500/10 text-blue-600",
    description:
      "Google's professional certificate covering SEO, SEM, analytics, and e-commerce strategy.",
  },
  {
    icon: BookOpen,
    name: "Marketing AI",
    issuer: "HubSpot Academy",
    date: "Coming soon",
    accent: "bg-orange-500/10 text-orange-600",
    badge: "In progress",
    description:
      "AI-powered marketing strategy, content automation, and campaign optimisation.",
  },
];

export function Credentials() {
  return (
    <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
      {credentials.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.name}
            className="rounded-2xl border border-rule bg-white p-6 shadow-soft transition-shadow hover:shadow-card"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.accent}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <h3 className="text-base font-semibold text-ink-900">
                {c.name}
              </h3>
              {c.badge && (
                <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent-700">
                  {c.badge}
                </span>
              )}
            </div>
            <div className="mt-1 text-sm font-medium text-ink-500">
              {c.issuer} · {c.date}
            </div>
            <p className="mt-3 text-sm text-ink-500 leading-relaxed">
              {c.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Compact inline version for use in homepage trust strip.
 *
 * Stable, evergreen phrasing — deliberately NOT enumerated per-cert.
 * Previously this listed each completed credential's issuer
 * ("Certified: Anthropic Google"), which:
 *   - went stale every time a course was added or completed
 *   - implied a fixed set rather than ongoing development
 * "Anthropic-trained · Google-certified · Actively studying" stays
 * accurate as new courses are added without a code change, and reads
 * as a practitioner who keeps current rather than a finished list.
 * The full, dated, verifiable cert details (incl. the Anthropic cert
 * number) live on /about via the <Credentials /> card grid. */
export function CredentialsBadgeRow() {
  const items = [
    "Anthropic-trained",
    "Google-certified",
    "Actively studying",
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-ink-500">
      <Award className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
      {items.map((label, idx) => (
        <span key={label} className="flex items-center gap-3">
          <span className="text-xs font-medium text-ink-700">{label}</span>
          {idx < items.length - 1 && (
            <span className="text-ink-300" aria-hidden="true">
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
