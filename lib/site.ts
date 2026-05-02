/**
 * Site-wide configuration. Single source of truth for branding,
 * navigation, contact details, and SEO defaults.
 */

export const site = {
  name: "Kabelo More",
  brand: "Kabelo More",
  // The URL stays kabelomore.com (one word) but the visible brand is the
  // founder's name with a space. Like Neil Patel: header says "Neil Patel",
  // domain is neilpatel.com.
  brandDomain: "kabelomore.com",
  tagline: "AI Visibility Consultant · Pretoria → London → New York",
  description:
    "GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) specialist helping businesses get found, cited, and recommended by ChatGPT, Claude, Gemini, and Perplexity. Schema markup, LLM citation strategy, and entity optimisation for industrial, legal, and medical firms in South Africa, the UK, and the US.",
  url: "https://kabelomore.com",
  ogImage: "/og-default.png",

  contact: {
    email: "kabelo@kabelomore.com",
    location: "Pretoria, South Africa",
    serving: "Serving clients in South Africa, UK, and US",
    // International format (no leading +, no spaces) for wa.me links + Twilio
    whatsappE164: "27760351084",
    // Display format (what humans see)
    whatsappDisplay: "+27 76 035 1084",
  },

  social: {
    linkedin: "https://www.linkedin.com/in/kabelomore/",
    instagram: "https://www.instagram.com/kabelomore/",
    twitter: "",
    youtube: "",
  },

  // Booking flow — Phase 1 uses WhatsApp directly. Add Calendly URL later
  // and the results page CTA will switch automatically.
  booking: {
    type: "whatsapp" as "whatsapp" | "calendly" | "email",
    calendlyUrl: "", // e.g. "https://calendly.com/kabelomore/discovery"
  },
} as const;

/**
 * Build a wa.me link with optional pre-filled message text.
 * Used by every WhatsApp CTA across the site.
 */
export function whatsappLink(prefilledText?: string): string {
  const base = `https://wa.me/${site.contact.whatsappE164}`;
  if (!prefilledText) return base;
  return `${base}?text=${encodeURIComponent(prefilledText)}`;
}

export const navigation = {
  primary: [
    { label: "Services", href: "/services" },
    { label: "How we work", href: "/how-we-work" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  cta: { label: "Free AI Scan", href: "/scan" },
} as const;

/**
 * Tier shape — the plain-English, payment-clear, "what you actually get" structure.
 *
 * payment      — clear payment terms (50/50 for once-off, monthly billing for retainers)
 * delivery     — concrete time to delivery
 * description  — plain English, no jargon, talks like a human
 * receives     — concrete deliverables ("what shows up in your inbox")
 * notThis      — what this is NOT (kills wrong assumptions)
 */

export type Tier = {
  id: string;
  rank: number;
  name: string;
  category: "scan" | "foundation" | "audit" | "retainer";
  price: { sa: string; intl: string };
  payment: string;
  delivery: string;
  bestFor: string;
  description: string;
  receives: string[];
  monthlyWork?: {
    intro: string;
    items: { task: string; effort: string }[];
    notSocialMedia: string;
  };
  // NEW: value-anchoring fields (retainers especially benefit from these)
  // comparableTo  — anchors the price to something the buyer already understands
  //                 (DStv, junior SMM, Semrush, agency retainer, etc.)
  // roiMath       — explicit break-even calculation so buyer doesn't have to invent it
  // cancelTerms   — visible cancellation terms; kills SA subscription anxiety
  comparableTo?: string;
  roiMath?: {
    breakEven: string; // "1 new customer per quarter" or similar
    targetReturn: string; // "30 customers / R150,000 / 2.3× ROI" etc.
  };
  cancelTerms?: string;
  cta: { label: string; href: string };
  highlight: boolean;
};

export const tiers: Tier[] = [
  {
    id: "scan",
    rank: 1,
    name: "Free AI Visibility Scan",
    category: "scan",
    price: { sa: "Free", intl: "Free" },
    payment: "Free — no card required",
    delivery: "24 hours",
    bestFor: "Anyone curious whether AI engines recommend their business today.",
    description:
      "We test how ChatGPT, Claude, Gemini and Perplexity respond when your customers search for your service. You get a 2-page report showing exactly what each AI said. No sales call unless you ask for one.",
    receives: [
      "Screenshots of what each of the 4 AI engines said about your business",
      "Names of the businesses AI recommended instead of you (your real digital competitors)",
      "Top 3 fixes that would move the needle most",
      "Delivered as a PDF to your email",
    ],
    cta: { label: "Request a scan", href: "/scan" },
    highlight: false,
  },
  {
    id: "foundation",
    rank: 2,
    name: "Foundation Pack",
    category: "foundation",
    price: { sa: "R12,500", intl: "$895 / £675" },
    payment: "50% to start · 50% on delivery",
    delivery: "4 weeks",
    bestFor:
      "Businesses with no website yet. We build everything from scratch — set up to be found by AI from day one. (Already have a website? See Optimization Pack instead.)",
    description:
      "Don't have a website yet? We build everything you need to be found online. A clean website, your Google Business Profile, your Facebook and Instagram setup, and the technical bits that AI engines need to recommend you. Most agencies skip the technical part. We don't. After delivery you get a free 10-min walkthrough on how to update content yourself, or you can add the optional Self-Edit Admin Panel (R2,500) for a WordPress-like editing experience.",
    receives: [
      "Live 5-page website on your own domain (we register it if you don't have one)",
      "Google Business Profile claimed, verified, and fully set up",
      "Schema markup deployed — the code AI engines read",
      "Facebook and Instagram pages set up or refreshed, with 5 starter posts on each",
      "10 listings on trusted business directories",
      "Business email (you@yourbusiness.co.za)",
      "30-minute walkthrough call + free 10-min self-edit walkthrough",
      "PDF documenting everything we did + all login details",
      "60-day support window for small fixes",
    ],
    cta: { label: "See Foundation Pack", href: "/foundation" },
    highlight: false,
  },
  {
    id: "foundation-lite",
    rank: 3,
    name: "Foundation Lite",
    category: "foundation",
    price: { sa: "R6,500", intl: "$495 / £375" },
    payment: "50% to start · 50% on delivery",
    delivery: "2 weeks",
    bestFor: "Solo traders or single-service businesses who need a basic, clean digital presence.",
    description:
      "A simpler version of the Foundation Pack for sole traders. One-page website, Google Business Profile, and one social platform set up properly. Same Method, smaller scope.",
    receives: [
      "Live 1-page website on your own domain",
      "Google Business Profile claimed and set up",
      "Schema markup on your site",
      "1 social platform set up (Facebook OR Instagram, your choice)",
      "5 starter posts published",
      "5 listings on trusted business directories",
      "Email setup (you@yourbusiness.co.za)",
      "20-min walkthrough call",
      "PDF with all login details",
    ],
    cta: { label: "Start Foundation Lite", href: "/brief/foundation-lite" },
    highlight: false,
  },
  {
    id: "optimization",
    rank: 35,
    name: "Optimization Pack",
    category: "foundation",
    price: { sa: "R10,500", intl: "$795 / £595" },
    payment: "50% to start · 50% on delivery",
    delivery: "3 weeks",
    bestFor:
      "Businesses with an existing website (any platform — WordPress, Wix, Squarespace, Shopify, or custom) that want AI visibility infrastructure added without rebuilding.",
    description:
      "You already have a website you're happy with. We don't touch it. We add the AI visibility layer on top — schema markup, GBP setup, citations, AI-shaped content. Same end goal as Foundation Pack (cited by AI engines), different starting point. Faster delivery because we're not building from scratch.",
    receives: [
      "Full audit of your existing site for AEO readiness",
      "Schema markup deployed (via plugin if WordPress, GTM if Wix/Squarespace, custom code if needed)",
      "Google Business Profile claimed, refreshed and verified",
      "10 directory listings with NAP-consistent data",
      "3 priority pages on your existing site rewritten in answer-shape (for AI engines)",
      "5 starter LinkedIn or Facebook posts aligned with AEO strategy",
      "Sitemap, robots.txt audit + llms.txt added",
      "30-min handover call + PDF doc with everything we did",
      "60-day support window",
    ],
    cta: { label: "Optimize my existing site", href: "/brief/optimization" },
    highlight: false,
  },
  {
    id: "optimization-lite",
    rank: 36,
    name: "Optimization Lite",
    category: "foundation",
    price: { sa: "R5,500", intl: "$395 / £295" },
    payment: "50% to start · 50% on delivery",
    delivery: "2 weeks",
    bestFor:
      "Sole traders or single-service businesses with a basic existing site (any platform) that want core AI visibility infrastructure added.",
    description:
      "Light version of Optimization Pack for sole traders. Schema markup, GBP, light citation work, and one priority page rewritten in answer-shape. Same Method, smaller scope, 2-week delivery.",
    receives: [
      "Audit of existing site for AEO readiness",
      "Schema markup deployed on key pages",
      "Google Business Profile claimed and set up",
      "5 directory listings with NAP-consistent data",
      "1 priority page rewritten in answer-shape",
      "20-min handover call",
      "PDF documentation of everything done",
    ],
    cta: { label: "Start Optimization Lite", href: "/brief/optimization-lite" },
    highlight: false,
  },
  {
    id: "discovery",
    rank: 4,
    name: "Discovery & Strategy Sprint",
    category: "audit",
    price: { sa: "R3,500", intl: "$295 / £225" },
    payment: "Paid in full upfront",
    delivery: "2 weeks",
    bestFor:
      "Anyone considering a Growth or Premium retainer. Clarity before commitment. Bundled free into the first month of any monthly retainer.",
    description:
      "Don't sign a retainer blind. We spend 2 weeks studying your business, your competition, and your customer — then deliver a written strategy showing exactly what to do, in what order, and why. You walk away with a roadmap whether you hire us to execute it or not.",
    receives: [
      "60-minute discovery interview (recorded + transcribed)",
      "Customer profile + ideal client mapping",
      "Competitor analysis: 3 competitors, full digital audit",
      "AI visibility baseline scan across 4 engines",
      "Written strategy document: prioritised 6-month roadmap",
      "30-minute strategy review call",
    ],
    cta: { label: "Book the Sprint", href: "/brief/discovery" },
    highlight: false,
  },
  {
    id: "starter",
    rank: 5,
    name: "Starter Audit",
    category: "audit",
    price: { sa: "R5,000", intl: "$295 / £235" },
    payment: "50% to start · 50% on delivery",
    delivery: "5 working days",
    bestFor:
      "Businesses that already have a website and Google Business Profile. You want to know exactly where you stand and what to fix.",
    description:
      "Find out exactly where you stand. We test how the 4 AI engines respond when your customers search for your service. We compare you to 3 competitors. We tell you the top 10 things to fix, ranked by what'll move the needle. You finish the week with a clear plan you can act on yourself or hire us to deliver.",
    receives: [
      "Full audit across ChatGPT, Claude, Gemini, Perplexity",
      "Competitive benchmark vs 3 direct competitors",
      "Website schema + Google Business Profile audit",
      "Top-10 prioritised fix list (effort vs impact)",
      "30-minute strategy call to walk through findings",
      "PDF report you can act on",
    ],
    cta: { label: "Start with the audit", href: "/brief/starter" },
    highlight: false,
  },
  {
    id: "local-growth-lite",
    rank: 55,
    name: "Local Growth Lite",
    category: "retainer",
    price: { sa: "R2,950 / mo", intl: "$210 / £180 / mo" },
    payment: "Monthly billing in advance · 3-month minimum · cancel anytime after",
    delivery: "Ongoing",
    bestFor:
      "Local SA businesses that want their AI visibility to keep growing on autopilot — without committing to a full agency retainer. The bridge between once-off work and full-service ongoing.",
    description:
      "The lighter, lower-friction monthly option for local businesses. Google Posts run automatically, daily AI tracking watches your business across 4 engines, and we touch up your GBP twice a month. No content production, no citation building — that's what Local Growth (the next tier up) is for.",
    receives: [
      "Google Posts automation — 4 posts/week, AI-drafted, you approve or auto-publish",
      "Daily AI Visibility tracking across all 4 engines (your business + 3 competitors)",
      "2 manual GBP optimisations per month (photos, posts, Q&A, hours)",
      "Quarterly AI scan with full report",
      "Email support — 48-hour response",
      "10% off any once-off add-on services",
    ],
    monthlyWork: {
      intro:
        "Mostly automated. The point: AI Visibility maintenance without you thinking about it. Here's the breakdown:",
      items: [
        { task: "Generating + scheduling 4 Google Posts/week (AI-drafted)", effort: "Auto" },
        { task: "Daily AI scan across 4 engines (audit-agent runs nightly)", effort: "Auto" },
        { task: "2 manual GBP touch-ups (photos, posts, Q&A)", effort: "1-2 hrs" },
        { task: "Monthly review + recommendation email", effort: "1 hr" },
      ],
      notSocialMedia:
        "This is set-and-forget AI visibility maintenance. Not social media management. The Google Posts and AI tracking happen automatically. Once a month we send you what changed and what to do about it.",
    },
    comparableTo:
      "A junior social media person in SA: R3-6k/mo for posts. A US Local SEO tool subscription: $100-300/mo. We bundle Google Post automation, AI tracking, and manual GBP work — at less than either alternative.",
    roiMath: {
      breakEven:
        "Pays for itself with one new customer per year. If your average customer is worth R5,000+, break-even is 0.7 customers from this work.",
      targetReturn:
        "Annual cost: R35,400. Realistic target: 4-12 new customers via AI visibility = R20,000-R60,000+ revenue. Net gain at the low end matches cost; at the high end is 2-3× ROI in year 1.",
    },
    cancelTerms:
      "3-month minimum. After that, cancel via email with 30 days notice. No phone calls, no retention pitch, no fine print.",
    cta: { label: "Start Local Growth Lite", href: "/brief/local-growth-lite" },
    highlight: false,
  },
  {
    id: "growth",
    rank: 6,
    name: "Local Growth",
    category: "retainer",
    price: { sa: "R5,500 / mo", intl: "$395 / £335 / mo" },
    payment: "Monthly billing in advance · 3-month minimum · cancel anytime after",
    delivery: "Ongoing",
    bestFor:
      "Local SA businesses that want AI visibility to compound. Active content production + citation building on top of automated GBP work. Where most clients land.",
    description:
      "Everything in Lite, plus we actually produce content and build citations every month — the work that compounds your AI authority over time. Discovery & Strategy Sprint included free in your first month.",
    receives: [
      "Everything in Local Growth Lite (Google Posts automation + daily AI tracking + GBP touch-ups)",
      "2 answer-shaped articles published on your site each month",
      "5 new third-party citations established each quarter",
      "Schema markup updates as new pages launch",
      "Monthly AI citation report across all 4 engines (vs quarterly in Lite)",
      "Monthly competitive intelligence report",
      "Monthly 30-min strategy call",
      "Discovery & Strategy Sprint in Month 1 (R3,500 value, free)",
      "48-hour priority support",
      "10% off any once-off add-on services",
    ],
    monthlyWork: {
      intro:
        "Roughly 20-35 hours of specialist work each month, on top of the automated Lite features. Not social media management. Here's the breakdown:",
      items: [
        { task: "Researching, writing and publishing 2 detailed articles", effort: "16-24 hrs" },
        { task: "Building 1-2 third-party citations per month", effort: "3-5 hrs" },
        { task: "Schema markup updates as new content publishes", effort: "1-2 hrs" },
        { task: "Monthly AI scan + competitor monitoring + report", effort: "3-5 hrs" },
        { task: "Monthly 30-min strategy call + ad-hoc support", effort: "2-3 hrs" },
        { task: "All Lite-tier automation (Google Posts, daily tracking, GBP touch-ups)", effort: "Mostly auto" },
      ],
      notSocialMedia:
        "This isn't social media management. The work is mostly technical and editorial — structured data, citations, and AI-shaped content. Some of it shows on your social feeds. Most of it shows up where you can't see it: in the signals AI engines use to decide who to recommend.",
    },
    comparableTo:
      "A SA full-service SMM agency: R6-9k/mo doing posts + reporting only. A US SEO retainer: $1,000-2,500/mo. We charge less than either AND actually move AI engines (which they don't).",
    roiMath: {
      breakEven:
        "Pays for itself with one new customer per quarter. If average customer = R5,000+, you need ~14 new customers/year to break even. Most clients see 30-60.",
      targetReturn:
        "Annual cost: R66,000. Realistic target: 30 new customers × R5,000 = R150,000+ revenue. Net gain: R84,000+. Floor, not ceiling.",
    },
    cancelTerms:
      "3-month minimum. After that, cancel via email with 30 days notice. No phone calls, no retention pitch, no fine print.",
    cta: { label: "Start Local Growth", href: "/brief/growth" },
    highlight: true,
  },
  {
    id: "premium",
    rank: 7,
    name: "AI Authority",
    category: "retainer",
    price: { sa: "R10,500 / mo", intl: "$750 / £640 / mo" },
    payment: "Monthly billing in advance · 3-month minimum · cancel anytime after",
    delivery: "Ongoing · first month is implementation",
    bestFor:
      "Businesses where AI visibility IS the growth strategy. Aggressive content velocity, citation building, LinkedIn brand presence, and direct access. For businesses ready to dominate their category in AI search.",
    description:
      "Everything in Local Growth, plus a heavy first-month implementation (schema + GBP rebuild + 5 citations + initial content), then 4 articles/month, LinkedIn management, reputation monitoring, and a monthly 60-min executive call. Direct access to me. 24-hour support SLA.",
    receives: [
      "Everything in Local Growth (Lite automation + content + citations + reporting)",
      "Discovery & Strategy Sprint in Month 1 (R3,500 value, free)",
      "First-month implementation: full schema + GBP rebuild + 5 citations + initial content",
      "30-day rescan with documented before/after",
      "4 answer-shaped articles published each month (vs 2 in Local Growth)",
      "8 Google Business Profile posts each month",
      "LinkedIn company page management — 3 posts/week aligned with AEO strategy",
      "Reputation monitoring + review response templates",
      "Monthly executive call (60-min, strategic level)",
      "Quarterly strategy review",
      "24-hour priority support SLA",
      "Custom integrations (Cowork automation, dashboards)",
    ],
    monthlyWork: {
      intro:
        "60-100 hours of specialist work each month. The first month is implementation-heavy. After that:",
      items: [
        { task: "Researching, writing and publishing 4 detailed articles", effort: "32-48 hrs" },
        { task: "Writing and scheduling 8 GBP posts + 12 LinkedIn posts", effort: "8-12 hrs" },
        { task: "Schema markup, structured data updates", effort: "3-5 hrs" },
        { task: "Citation building, monitoring, and refresh", effort: "4-6 hrs" },
        { task: "Reputation monitoring + writing review responses", effort: "3-5 hrs" },
        { task: "AI citation tracking + monthly + executive calls", effort: "6-8 hrs" },
        { task: "Strategic work, custom integrations, project management", effort: "4-6 hrs" },
      ],
      notSocialMedia:
        "This is technical AEO work plus brand presence at the level a serious business needs. The LinkedIn posting is part of it because LinkedIn now powers AI search results. But the core work is what AI engines read to decide who to recommend — schema, citations, answer-shaped content — not Instagram graphics.",
    },
    comparableTo:
      "A boutique SA digital agency: R15-25k/mo doing surface SEO + posts. A US-based AEO/SEO retainer: $2,500-5,000/mo. A senior in-house marketer's salary: R50k+/mo plus tools. We do the AEO heavy lift — at less than half of any alternative.",
    roiMath: {
      breakEven:
        "Pays for itself with one new customer per quarter at R5,000+. Most AI Authority clients see 60-150 new customers/year via AI search.",
      targetReturn:
        "Annual cost: R126,000. Realistic target: 60 new customers × R5,000 = R300,000+ revenue. Net gain: R174,000+. For B2B with R20k+ deals, 6 new customers = R120k = break even; 30 = R600k = 4.7× ROI.",
    },
    cancelTerms:
      "3-month minimum (covers the implementation-heavy first month + payback). After that, cancel via email with 30 days notice. No phone calls, no retention pitch, no fine print.",
    cta: { label: "Apply for AI Authority", href: "/brief/premium" },
    highlight: false,
  },
  {
    id: "strategy-partner",
    rank: 8,
    name: "Strategy Partner",
    category: "retainer",
    price: { sa: "R20,000 / mo", intl: "$1,395 / £1,150 / mo" },
    payment: "Monthly billing in advance · 6-month minimum · cancel anytime after",
    delivery: "Ongoing · embedded role",
    bestFor:
      "Businesses where I'm essentially your fractional Head of AI Visibility. Quarterly strategy off-sites, custom dashboards, multi-region rollouts, and direct executive access. For mid-market firms scaling AI presence across SA, UK, or US markets simultaneously.",
    description:
      "Everything in AI Authority, plus I act as a strategic partner — not a vendor. Weekly executive sync. Quarterly off-site strategy day. Custom AI visibility dashboards built specifically for your business. Multi-market rollout support. Senior-level access for leadership decisions.",
    receives: [
      "Everything in AI Authority (4 articles, LinkedIn, reputation, monthly executive call)",
      "Weekly 30-min executive sync (vs monthly in AI Authority)",
      "Quarterly strategy off-site day (4 hrs deep work, in-person if Pretoria/JHB or virtual)",
      "Custom AI visibility dashboard built for your business",
      "Multi-market support (SA + UK, or SA + US, or all three)",
      "Direct mobile/WhatsApp access to me during business hours",
      "Annual brand audit + competitive intelligence deep-dive",
      "First-look access to new tools and methods I'm building",
      "Priority custom integrations as your business grows",
    ],
    monthlyWork: {
      intro:
        "100-160 hours of specialist + strategic work each month. The work mix tilts heavier toward strategy and partner-level engagement:",
      items: [
        { task: "Everything in AI Authority (content, citations, GBP, LinkedIn)", effort: "60-100 hrs" },
        { task: "Weekly executive sync + ad-hoc strategic input", effort: "8-10 hrs" },
        { task: "Custom dashboard build + maintenance", effort: "6-10 hrs" },
        { task: "Multi-market research + localised content adaptation", effort: "8-15 hrs" },
        { task: "Quarterly off-site prep + delivery (averaged monthly)", effort: "4-6 hrs" },
        { task: "Annual brand + competitive deep-dive (averaged monthly)", effort: "2-4 hrs" },
      ],
      notSocialMedia:
        "This is fractional executive work. I'm not your social media manager — I'm your AI visibility strategist with hands-on delivery. The model is: I think about your AI presence the way a Head of Growth would, but at a fraction of the cost and with the technical execution built in.",
    },
    comparableTo:
      "A fractional CMO or Head of Growth: R40-80k/mo in SA, $8-15k/mo in US. A senior in-house marketer + agency stack: R60k+/mo combined. We do this for less than half — and execution is built in, not outsourced.",
    roiMath: {
      breakEven:
        "Pays for itself with one mid-size B2B customer per year (R250k+ deal value). Or 4 new customers per month at R5k. Most Strategy Partner clients are B2B with deal values where 1-2 wins/year covers it.",
      targetReturn:
        "Annual cost: R240,000. Realistic target for B2B: 2-5 enterprise wins × R250k+ = R500k-R1.25M revenue. For volume retail/services: 80-150 new customers × R5k = R400k-R750k. Net gain: R200k-R1M+ in year 1.",
    },
    cancelTerms:
      "6-month minimum (the dashboard build + multi-market setup takes that long to compound). After that, cancel via email with 60 days notice. No phone calls, no retention pitch, no fine print.",
    cta: { label: "Apply for Strategy Partner", href: "/brief/strategy-partner" },
    highlight: false,
  },
];

/**
 * Add-ons — specialty services that attach to any tier or stand alone.
 */

export type AddOn = {
  id: string;
  name: string;
  category: "setup" | "content" | "growth" | "ongoing";
  price: { sa: string; intl: string };
  payment: string;
  delivery: string;
  description: string;
  receives: string[];
  cta: { label: string; href: string };
};

export const addOns: AddOn[] = [
  {
    id: "admin-panel",
    name: "Self-Edit Admin Panel",
    category: "setup",
    price: { sa: "R2,500", intl: "$195 / £145" },
    payment: "Paid in full upfront (under R5K)",
    delivery: "2 days",
    description:
      "Optional admin panel for Foundation Pack clients who want to update content themselves without calling us. WordPress-like editing UI accessible at /admin on your site. You log in with your GitHub account, edit blog posts and key content fields, hit publish — changes go live in 60 seconds. Free 10-minute walkthrough is included with every Foundation Pack delivery; this add-on upgrades that to a full visual editor.",
    receives: [
      "/admin panel installed on your site (Decap CMS — free, open-source)",
      "GitHub OAuth connection so login is secure",
      "Editable schema for blog posts, FAQ items, basic content blocks",
      "15-minute walkthrough call showing you how to use it",
      "PDF reference doc for common edits",
    ],
    cta: { label: "Add admin panel", href: "/scan?tier=admin-panel" },
  },
  {
    id: "gbp-setup",
    name: "GBP Setup & Verification",
    category: "setup",
    price: { sa: "R3,500", intl: "$295 / £215" },
    payment: "Paid in full upfront (under R5K)",
    delivery: "7 days",
    description:
      "We claim, verify, and fully set up your Google Business Profile. Categories, services, hours, photos, description — the works. For businesses that don't have a GBP yet or whose GBP is barely filled in.",
    receives: [
      "GBP claimed and verified",
      "All categories and services accurately listed",
      "Hours, address, contact details correct",
      "10+ photos uploaded and labelled",
      "Compelling business description with relevant keywords",
      "Initial 3 Google posts published",
    ],
    cta: { label: "Get my GBP done", href: "/scan?tier=gbp-setup" },
  },
  {
    id: "schema",
    name: "Schema Markup (AI-Agent Pack)",
    category: "setup",
    price: { sa: "R4,500", intl: "$395 / £295" },
    payment: "50% to start · 50% on delivery",
    delivery: "5 days",
    description:
      "We add structured data to your website — the invisible code that tells AI engines exactly what your business is, what you sell, where you are, and who trusts you. Without it, AI has to guess. With it, AI has verified data it can confidently quote.",
    receives: [
      "LocalBusiness schema deployed",
      "Service schema for each main service you offer",
      "Organization + Person schema",
      "FAQ schema for common customer questions",
      "Schema validation against Google's Rich Results Test",
      "Documentation showing what we deployed",
    ],
    cta: { label: "Add Schema Pack", href: "/scan?tier=schema" },
  },
  {
    id: "citation-starter",
    name: "Citation Starter (30 listings)",
    category: "setup",
    price: { sa: "R4,500", intl: "$295 / £225" },
    payment: "50% to start · 50% on delivery",
    delivery: "7 days",
    description:
      "We get your business listed on 30 trusted business directories — the foundation layer AI engines and search engines use to verify a business is real and trustworthy. Includes major directories, plus the data aggregator sync that pushes you to Apple Maps, Foursquare, and GPS networks like Uber.",
    receives: [
      "Business listed on 30 manually verified directories",
      "Data aggregator sync (Foursquare, Apple Maps, GPS networks)",
      "All listings with consistent name, address, phone (NAP)",
      "Login details for accounts created on your behalf",
      "Submission report showing each listing",
    ],
    cta: { label: "Start Citation Pack", href: "/scan?tier=citation-starter" },
  },
  {
    id: "citation-pro",
    name: "Citation Pro (60 listings + Express)",
    category: "setup",
    price: { sa: "R7,500", intl: "$495 / £395" },
    payment: "50% to start · 50% on delivery",
    delivery: "5 days (Express)",
    description:
      "Everything in Citation Starter, doubled in scope, with the addition of duplicate listing cleanup and industry-specific directories for your vertical (BBBEE registry for SA, sector directories for medical, legal, industrial, etc.).",
    receives: [
      "60 manually verified citations",
      "Data aggregator sync",
      "Duplicate listing cleanup across known sites",
      "Industry-specific directories (BBBEE, mining, legal, medical — by vertical)",
      "Express 5-day delivery",
      "Full submission report",
    ],
    cta: { label: "Get Citation Pro", href: "/scan?tier=citation-pro" },
  },
  {
    id: "citation-enterprise",
    name: "Citation Enterprise (100+ + 3mo monitoring)",
    category: "setup",
    price: { sa: "R12,500", intl: "$795 / £625" },
    payment: "50% to start · 50% on delivery",
    delivery: "10 days + 3 months ongoing",
    description:
      "100+ citations across general and industry-specific directories, plus 3 months of ongoing monitoring with monthly mention reports. For businesses serious about owning their category in AI search.",
    receives: [
      "100+ manually verified citations",
      "Industry-specific directory submissions",
      "Duplicate listing cleanup",
      "3 months of ongoing monitoring",
      "Monthly mention + citation rate reports",
      "Quarterly refresh of stale listings",
    ],
    cta: { label: "Go Enterprise", href: "/scan?tier=citation-enterprise" },
  },
  {
    id: "content-rewrite",
    name: "Content Clarity Rewrite (5 pages)",
    category: "content",
    price: { sa: "R6,500", intl: "$495 / £395" },
    payment: "50% to start · 50% on delivery",
    delivery: "10 days",
    description:
      "AI engines are literal readers with zero patience. If your homepage and service pages don't answer 'what do you sell, who is it for, what does it cost, how does it work' in plain words — AI ignores you. We rewrite your 5 most important pages for clarity. Designed for AI agents to extract, but reads like a human wrote it.",
    receives: [
      "Audit of 5 priority pages (you choose which)",
      "Plain-English rewrite of each page",
      "Schema-friendly headers and structure",
      "FAQ blocks added where appropriate",
      "Clear pricing and call-to-action structure",
      "Implemented on your site (we publish, you approve)",
    ],
    cta: { label: "Get my pages rewritten", href: "/scan?tier=content-rewrite" },
  },
  {
    id: "website-optimization",
    name: "Website Optimization Sprint",
    category: "setup",
    price: { sa: "R8,500", intl: "$625 / £495" },
    payment: "50% to start · 50% on delivery",
    delivery: "3 weeks",
    description:
      "Your website exists but underperforms. Page speed, mobile, accessibility, conversion — we audit and fix the things that lose customers and AI signals. One-time deep work.",
    receives: [
      "Full technical SEO audit",
      "Page speed and Core Web Vitals fixes",
      "Mobile responsiveness review and fixes",
      "Accessibility (ARIA tags, semantic HTML)",
      "Internal linking improvements",
      "Up to 5 conversion-focused page edits",
    ],
    cta: { label: "Fix my website", href: "/scan?tier=website-optimization" },
  },
  {
    id: "listicle",
    name: "Authority Listicle Production",
    category: "content",
    price: { sa: "R4,500", intl: "$395 / £275" },
    payment: "50% to start · 50% on delivery",
    delivery: "10 days per listicle",
    description:
      "Long-form 'Top 10 [hyper-specific category]' articles published on kabelomore.com that AI engines treat as authoritative source data. We feature your business and benchmark you against real competitors. Pay once per listicle.",
    receives: [
      "1,500-2,500 word researched listicle",
      "ItemList + Article schema",
      "Your business positioned in the article (honestly, with criteria)",
      "Distributed via LinkedIn",
      "Listicle hosted on kabelomore.com — your link to share",
    ],
    cta: { label: "Commission a listicle", href: "/scan?tier=listicle" },
  },
  {
    id: "dm-automation",
    name: "DM Automation Setup",
    category: "growth",
    price: { sa: "R6,500", intl: "$495 / £395" },
    payment: "50% to start · 50% on delivery",
    delivery: "2 weeks",
    description:
      "Auto-replies in Instagram and Facebook DMs that turn followers into leads — without users leaving the app. Set up once, runs forever. We configure the flows, write the copy, hand you the keys.",
    receives: [
      "Instagram + Facebook DM automation flows configured",
      "Lead capture sequences (3-5 conversations)",
      "Keyword triggers for common questions",
      "Integration with email or CRM (your choice)",
      "Documentation + 30-min training session",
    ],
    cta: { label: "Set up DM Automation", href: "/scan?tier=dm-automation" },
  },
  {
    id: "digital-pr",
    name: "Digital PR for AI Authority",
    category: "ongoing",
    price: { sa: "R10,500 / mo", intl: "$795 / £595 / mo" },
    payment: "Monthly billing in advance · 3-month minimum",
    delivery: "Ongoing",
    description:
      "AI engines don't trust businesses based on what those businesses say about themselves. They trust based on what trusted third parties say. We pitch journalists, get earned mentions in industry publications, and build the external citations AI needs to recommend you confidently.",
    receives: [
      "8-10 journalist/publisher pitches per month",
      "Target 1-2 secured media mentions per month",
      "Industry publication targeting (BizCommunity, Engineering News, etc.)",
      "Press release drafting + distribution (1/month)",
      "HARO-style quote sourcing",
      "Monthly mentions tracking + AI citation impact report",
    ],
    cta: { label: "Add Digital PR", href: "/scan?tier=digital-pr" },
  },
  {
    id: "social-management",
    name: "Social Media Management (LinkedIn focus)",
    category: "ongoing",
    price: { sa: "R6,500 / mo", intl: "$495 / £395 / mo" },
    payment: "Monthly billing in advance · 3-month minimum",
    delivery: "Ongoing",
    description:
      "LinkedIn-led social management aligned with your AEO strategy. 3 posts/week on LinkedIn plus 1 secondary platform of your choice. Content calendar, content production, light engagement monitoring.",
    receives: [
      "LinkedIn company page management — 3 posts/week",
      "1 secondary platform (Instagram OR Twitter/X)",
      "Monthly content calendar aligned with AEO strategy",
      "Light engagement monitoring (DMs, comments)",
      "Monthly performance report",
    ],
    cta: { label: "Add Social Management", href: "/scan?tier=social-management" },
  },
  {
    id: "reputation",
    name: "Reputation Management",
    category: "ongoing",
    price: { sa: "R3,500 / mo", intl: "$295 / £215 / mo" },
    payment: "Monthly billing in advance · 3-month minimum",
    delivery: "Ongoing",
    description:
      "Review monitoring across Google, Yelp, and industry sites. We get alerts when reviews come in. We write 5 review responses per month. We escalate negatives to you with a recommended approach before responding.",
    receives: [
      "Daily review monitoring across major platforms",
      "5 review responses written per month",
      "Negative review escalation playbook",
      "Monthly review summary + sentiment report",
    ],
    cta: { label: "Add Reputation Management", href: "/scan?tier=reputation" },
  },
  {
    id: "content-boost",
    name: "Content Boost (extra 2 pieces/mo)",
    category: "ongoing",
    price: { sa: "R4,500 / mo", intl: "$375 / £275 / mo" },
    payment: "Monthly billing in advance · 3-month minimum",
    delivery: "Ongoing",
    description:
      "Need more content velocity than your tier includes? This add-on gives you 2 additional answer-shaped articles per month on top of your tier baseline. Useful for clients pushing topical authority hard.",
    receives: [
      "2 additional articles per month (researched + written + published)",
      "Schema markup on each piece",
      "Internal linking to your existing content",
      "Distributed via LinkedIn",
    ],
    cta: { label: "Add Content Boost", href: "/scan?tier=content-boost" },
  },
  {
    id: "freshness",
    name: "Content Freshness Subscription",
    category: "ongoing",
    price: { sa: "R3,500 / quarter", intl: "$295 / £225 / quarter" },
    payment: "Quarterly billing in advance",
    delivery: "Quarterly refresh cycle",
    description:
      "Stale content is a trust killer for AI engines. They favour current data. Every quarter we refresh your core pages — update statistics, refresh examples, update 'last modified' dates, regenerate schema. Low effort, high stickiness.",
    receives: [
      "Refresh of up to 10 core pages per quarter",
      "Statistics and references updated",
      "'Last updated' timestamps on all core pages",
      "Schema markup regenerated",
      "Quarterly refresh report",
    ],
    cta: { label: "Add Freshness Sub", href: "/scan?tier=freshness" },
  },
];

/**
 * Helper for tier-page filtering by category.
 */
export const tierCategories = {
  scan: tiers.filter((t) => t.category === "scan"),
  foundation: tiers.filter((t) => t.category === "foundation"),
  audit: tiers.filter((t) => t.category === "audit"),
  retainer: tiers.filter((t) => t.category === "retainer"),
};

export const addOnCategories = {
  setup: addOns.filter((a) => a.category === "setup"),
  content: addOns.filter((a) => a.category === "content"),
  growth: addOns.filter((a) => a.category === "growth"),
  ongoing: addOns.filter((a) => a.category === "ongoing"),
};
