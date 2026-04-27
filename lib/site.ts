/**
 * Site-wide configuration. Single source of truth for branding,
 * navigation, contact details, and SEO defaults.
 */

export const site = {
  name: "Kabelo More",
  brand: "Kabelomore",
  tagline: "AI Visibility Consulting",
  description:
    "Most businesses are invisible to AI search. I help them get recommended by ChatGPT, Claude, Gemini, and Perplexity. Audits, implementation, and ongoing optimisation for businesses in South Africa, the UK, and the US.",
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
    id: "audit",
    rank: 2,
    name: "Visibility Audit",
    price: { sa: "R3,500", intl: "$295 / £225" },
    cadence: "Once-off · 5 working days",
    description:
      "A complete audit of your AI visibility, structured data, GBP, and competitive position. Includes a 30-minute strategy call.",
    bullets: [
      "Audit across 4 AI engines",
      "Competitive benchmark vs 3 competitors",
      "Schema, GBP, and citation diagnosis",
      "Top-10 prioritised fix list",
    ],
    cta: { label: "Start with an audit", href: "/scan?tier=audit" },
    highlight: false,
  },
  {
    id: "build",
    rank: 3,
    name: "Visibility Build",
    price: { sa: "R12,500", intl: "$1,195 / £895" },
    cadence: "Once-off · 3-4 weeks",
    description:
      "Full implementation: schema deployed, GBP optimised, content published, citations established. Including a 30-day rescan and before/after report.",
    bullets: [
      "Everything in the Audit",
      "LocalBusiness + Service + FAQ schema deployed",
      "GBP optimised to 100% completeness",
      "3 answer-shaped content pieces",
      "5 third-party citations established",
      "30-day rescan with before/after",
    ],
    cta: { label: "Book a build", href: "/scan?tier=build" },
    highlight: true,
  },
  {
    id: "partner",
    rank: 4,
    name: "Visibility Partner",
    price: { sa: "R4,950 / mo", intl: "$595 / £445 / mo" },
    cadence: "3-month minimum, month-to-month after",
    description:
      "Continuous AI visibility — monthly tracking, content, competitive intel, quarterly strategy reviews. For businesses treating AEO as a growth channel.",
    bullets: [
      "Monthly citation tracking across 4 AI engines",
      "2 new content pieces per month",
      "Monthly competitive intelligence report",
      "Quarterly strategy review",
      "48-hour priority support",
      "10% off any project work",
    ],
    cta: { label: "Become a Partner", href: "/scan?tier=partner" },
    highlight: false,
  },
];
