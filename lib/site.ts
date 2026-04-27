/**
 * Site-wide configuration. Single source of truth for branding,
 * navigation, contact details, and SEO defaults.
 */

export const site = {
  name: "Kabelo More",
  brand: "Kabelomore",
  tagline: "GEO / AEO Specialist · AI Search Visibility",
  description:
    "GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) specialist helping businesses get found, cited, and recommended by ChatGPT, Claude, Gemini, and Perplexity. Schema markup, LLM citation strategy, and entity optimisation for industrial, legal, and medical firms in South Africa, the UK, and the US.",
  url: "https://kabelomore.com",
  ogImage: "/og-default.png",

  contact: {
    email: "kabelo@kabelomore.com",
    location: "Pretoria, South Africa",
    serving: "Serving clients in South Africa, UK, and US",
  },

  social: {
    linkedin: "https://www.linkedin.com/in/kabelomore/",
    instagram: "https://www.instagram.com/kabelomore/",
    twitter: "",
    youtube: "",
  },

  ngo: {
    name: "Digital Dreamers NPC",
    pboNumber: "930086847",
    incomeTaxRef: "9553563207",
    section18A: "Section 18A registered Public Benefit Organisation",
  },
} as const;

export const navigation = {
  primary: [
    { label: "Services", href: "/services" },
    { label: "Process", href: "/process" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  cta: { label: "Free AI Scan", href: "/scan" },
} as const;

export const tiers = [
  {
    id: "scan",
    rank: 1,
    name: "Free AI Visibility Scan",
    price: { sa: "Free", intl: "Free" },
    cadence: "24-hour turnaround",
    description:
      "A 2-page snapshot of what ChatGPT, Claude, Gemini, and Perplexity say about your business when your customers search.",
    bullets: [
      "Verbatim AI engine responses",
      "Top 3 competitors named",
      "No obligation, no follow-up unless you want one",
    ],
    cta: { label: "Request a scan", href: "/scan" },
    highlight: false,
  },
  {
    id: "starter",
    rank: 2,
    name: "Starter",
    price: { sa: "R5,000", intl: "$295 / £235" },
    cadence: "Once-off · 5 working days",
    description:
      "Your AI Visibility roadmap. Full audit across 4 AI engines, competitive benchmark, schema and GBP diagnosis, prioritised fix list, and a 30-minute strategy call. Built so you can act with or without us.",
    bullets: [
      "Audit across 4 AI engines (verbatim responses)",
      "Competitive benchmark vs 3 direct competitors",
      "Website schema + GBP completeness audit",
      "Top-10 prioritised fix list (effort vs impact)",
      "30-minute strategy call",
    ],
    cta: { label: "Start with the audit", href: "/scan?tier=starter" },
    highlight: false,
  },
  {
    id: "growth",
    rank: 3,
    name: "Growth",
    price: { sa: "R8,500 / mo", intl: "$495 / £395 / mo" },
    cadence: "3-month minimum · then month-to-month",
    description:
      "Continuous AEO as a growth channel. Monthly citation tracking, ongoing content production, competitive intelligence, and quarterly strategy. For businesses ready to compound visibility month-over-month.",
    bullets: [
      "Monthly citation tracking across 4 AI engines",
      "2 answer-shaped content pieces per month",
      "Monthly competitive intelligence report",
      "Quarterly strategy review (60-min call)",
      "Priority 48-hour support",
      "10% off any project work",
    ],
    cta: { label: "Start Growth tier", href: "/scan?tier=growth" },
    highlight: true,
  },
  {
    id: "premium",
    rank: 4,
    name: "Premium",
    price: { sa: "R15,000 / mo", intl: "$895 / £695 / mo" },
    cadence: "3-month minimum · includes initial implementation",
    description:
      "Everything in Growth, plus full implementation in the first 30 days: schema deployed, GBP rebuilt, citations established, 4 content pieces per month, and direct executive-level support. For businesses where AI visibility is the growth strategy, not a side project.",
    bullets: [
      "Everything in Growth, doubled velocity",
      "First-month implementation: schema, GBP, citations",
      "4 answer-shaped content pieces per month",
      "Monthly executive call (60-min strategic)",
      "24-hour priority support SLA",
      "Custom integrations (Cowork automation)",
    ],
    cta: { label: "Apply for Premium", href: "/scan?tier=premium" },
    highlight: false,
  },
];
