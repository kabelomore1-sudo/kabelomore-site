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
      "Solo practitioners and owner-operators — single-doctor practices, sole-practitioner attorneys, owner-run industrial firms. You already have a website and GBP. You don't have time to maintain them. You need them to keep working without thinking about it.",
    description:
      "The lighter monthly option for professional firms with one practitioner or owner. We keep your core SERP real estate — website + GBP + LinkedIn — looking active without you lifting a finger. Daily AI tracking watches your visibility across 4 engines. Quarterly review request campaign keeps reviews flowing. No content production, no industry citations — that's what Local Growth is for.",
    receives: [
      "Daily AI Visibility tracking across 4 engines (your firm + 3 competitors)",
      "4 GBP posts/week (AI-drafted, auto-published or you approve)",
      "1 LinkedIn company page post/week (AI-drafted)",
      "Quarterly review request campaign (template emails to recent customers)",
      "2 manual GBP optimisations/month (photos, Q&A, hours, services)",
      "Quarterly AI scan with full report",
      "Email support — 48-hour response",
      "10% off any once-off add-on services",
    ],
    monthlyWork: {
      intro:
        "Mostly automated. The point: professional credibility maintenance without you thinking about it.",
      items: [
        { task: "Generating + auto-publishing 4 GBP posts/week + 1 LinkedIn/week", effort: "Auto" },
        { task: "Daily AI scan across 4 engines (audit-agent runs nightly)", effort: "Auto" },
        { task: "2 manual GBP touch-ups (photos, Q&A, hours)", effort: "1-2 hrs" },
        { task: "Quarterly review request campaign", effort: "1 hr/qtr" },
        { task: "Monthly review + recommendation email", effort: "1 hr" },
      ],
      notSocialMedia:
        "This is professional credibility maintenance. We don't do Instagram or TikTok — your patients/clients/buyers aren't there. We make sure when someone Googles your practice or asks ChatGPT about specialists in your field, your name keeps showing up — without you posting anything yourself.",
    },
    comparableTo:
      "A junior SMM in SA: R3-6k/mo posting on Instagram (where most of your patients/clients aren't). A US local SEO tool subscription: $100-300/mo with no LinkedIn or review work. We bundle GBP + LinkedIn company + AI tracking + review prompting — at less than either.",
    roiMath: {
      breakEven:
        "Pays for itself with one new patient/client/contract per year. If your average customer is worth R5,000+, break-even is 0.7 customers.",
      targetReturn:
        "Annual cost: R35,400. Realistic target: 4-12 new customers via AI visibility = R20,000-R60,000+ revenue. For medical specialists with R20k average procedure value, 2 new procedures = R40k = 12% ROI floor.",
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
      "Small-to-mid practices and firms — medical practices with 2-10 doctors, law firms with 3-15 attorneys, industrial businesses with 5-30 staff. You want to dominate when someone Googles or asks AI for specialists in your area. Where most clients land.",
    description:
      "Active credibility-building for professional firms. Everything in Lite, plus we publish authoritative content on your site, build industry-specific citations, run review velocity, and ghost-write LinkedIn for your founder/principal. Every property feeds the same compounding AEO strategy. Discovery & Strategy Sprint included free in your first month.",
    receives: [
      "Everything in Local Growth Lite (GBP + LinkedIn company + AI tracking + reviews)",
      "2 long-form articles/month on your site (case studies, service deep-dives, FAQ pages)",
      "LinkedIn founder/principal personal brand — 1 ghost-written post/week",
      "LinkedIn company page — 3 posts/week (vs 1 in Lite)",
      "5 new citations/quarter on industry-specific directories (Medical Board, Law Society, BBBEE, sector-specific)",
      "Active review velocity: 5 review responses/month + 1 review request campaign/month",
      "Schema markup updates as new pages launch",
      "Monthly competitive intelligence report (what your top 3 are doing)",
      "Monthly 30-min strategy call",
      "Discovery & Strategy Sprint in Month 1 (R3,500 value, free)",
      "48-hour priority support",
      "10% off any once-off add-on services",
    ],
    monthlyWork: {
      intro:
        "Roughly 25-40 hours of specialist work each month, on top of the automated Lite features. Integrated credibility-building for professional firms.",
      items: [
        { task: "Researching, writing and publishing 2 long-form articles", effort: "16-24 hrs" },
        { task: "LinkedIn founder ghost-writing — 4 posts/month", effort: "4-6 hrs" },
        { task: "LinkedIn company page — 3 posts/week", effort: "3-4 hrs" },
        { task: "Building 1-2 industry-specific citations/month", effort: "3-5 hrs" },
        { task: "Schema markup updates as new content publishes", effort: "1-2 hrs" },
        { task: "Review responses + 1 request campaign/month", effort: "2-3 hrs" },
        { task: "Monthly AI scan + competitor monitoring + report", effort: "3-5 hrs" },
        { task: "Monthly 30-min strategy call + ad-hoc support", effort: "2-3 hrs" },
        { task: "All Lite-tier automation (GBP, daily tracking, review prompting)", effort: "Mostly auto" },
      ],
      notSocialMedia:
        "This is integrated professional credibility-building. The LinkedIn ghost-writing, the industry directory citations, the review velocity, the answer-shaped articles — all of it feeds the same goal: when someone in your service area asks Google or ChatGPT about specialists in your category, you're the answer. No Instagram, no TikTok — your buyers don't make decisions there.",
    },
    comparableTo:
      "A SA boutique digital marketing firm doing surface SEO + social: R8-15k/mo. A US AEO retainer: $1,000-2,500/mo. A traditional SMM agency in SA: R6-9k/mo for Instagram posts only. We do less generic work and more category-specific work — at less than any alternative.",
    roiMath: {
      breakEven:
        "One new client per quarter. For medical specialists (R3k consult + R20k procedure), break-even is one procedure. For law firms with R50k retainers, break-even is one matter every 9 months. For industrial with R100k+ contracts, one win pays for the year.",
      targetReturn:
        "Annual cost: R66,000. Realistic for medical/legal practices: 5-15 new clients × R20k-R50k = R100k-R750k revenue. For industrial: 1-3 new contracts × R50k-R500k. 2-10× ROI in year 1.",
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
      "Established practices and firms — medical groups with 10+ doctors, law firms with 15-50 attorneys, industrial businesses with R50M+ revenue. You don't just want to show up — you want to BE the answer for your specialty in your market.",
    description:
      "Comprehensive professional authority build. Everything in Local Growth, plus we ghost-write your founder's LinkedIn at scale, pitch you to industry publications (Medical Brief, De Rebus, Engineering News, BizCommunity), produce a monthly educational YouTube video, run an active review velocity programme, and optimize your knowledge panel. Direct executive access. 24-hour SLA.",
    receives: [
      "Everything in Local Growth (articles + LinkedIn + citations + reviews)",
      "Discovery & Strategy Sprint in Month 1 (R3,500 value, free)",
      "First-month implementation: full schema + GBP rebuild + 10 industry citations + initial authority content",
      "30-day rescan with documented before/after",
      "4 long-form articles/month (vs 2 in Local Growth) — depth + authority",
      "LinkedIn founder/principal personal brand — 3 ghost-written posts/week (vs 1)",
      "LinkedIn company page — 5 posts/week + active engagement",
      "8 GBP posts/month",
      "Industry PR pitches — 2/month (Medical Brief, De Rebus, Engineering News, BizCommunity, sector-specific)",
      "HARO / journalist quote sourcing — target 4 placements/quarter",
      "YouTube channel: 1 educational video/month (you record DIY, we edit + caption + structure for AI)",
      "Active review velocity: 10 review responses + 2 review request campaigns/month",
      "Knowledge panel optimization (Wikipedia eligibility check + branded entity work)",
      "Monthly executive call (60-min, strategic level)",
      "Quarterly strategy review",
      "24-hour priority support SLA",
      "Custom integrations (CRM, dashboards)",
    ],
    monthlyWork: {
      intro:
        "60-100 hours of specialist work each month. The first month is implementation-heavy. After that, integrated professional authority work.",
      items: [
        { task: "Researching, writing and publishing 4 long-form articles", effort: "32-48 hrs" },
        { task: "LinkedIn ghost-writing (founder + company) — 12 posts/wk equivalent", effort: "8-12 hrs" },
        { task: "Writing and scheduling 8 GBP posts/month", effort: "2-3 hrs" },
        { task: "Industry PR pitches + HARO journalist sourcing", effort: "4-6 hrs" },
        { task: "YouTube video editing + captioning + AI structuring", effort: "3-5 hrs" },
        { task: "Review velocity programme (responses + request campaigns)", effort: "3-5 hrs" },
        { task: "Schema + citation maintenance", effort: "3-5 hrs" },
        { task: "AI tracking + monthly + executive calls", effort: "6-8 hrs" },
        { task: "Knowledge panel + entity optimization work", effort: "2-4 hrs" },
      ],
      notSocialMedia:
        "This is professional category leadership. LinkedIn for thought leadership. Industry pubs (Medical Brief, De Rebus, Engineering News) for credibility. YouTube for educational authority. Reviews for trust. Schema and citations for AI engines to confidently quote you. Zero Instagram, zero TikTok — your buyers/patients/clients aren't there.",
    },
    comparableTo:
      "A boutique SA marketing/PR firm: R20-40k/mo. A US AEO/PR retainer: $3-5k/mo. A senior in-house marketer's salary: R50k+/mo plus tools and agency stack. We do the integrated authority work — at less than half of any alternative.",
    roiMath: {
      breakEven:
        "For medical: 1 high-value procedure/quarter (R20-50k). For legal: 1 matter/year (R100k+). For industrial: 1 contract/year (R200k+). Most AI Authority clients clear break-even in months 2-3.",
      targetReturn:
        "Annual cost: R126,000. Realistic for medical specialists: 30-80 new patients × R20,000 = R600k-R1.6M. For B2B legal: 5-12 new clients × R100k = R500k-R1.2M. For industrial: 2-6 new contracts × R250k = R500k-R1.5M. 4-12× ROI in year 1.",
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
      "Mid-market+ professional firms operating across SA + UK and/or US. Medical groups with multi-region presence, law firms with international clients, industrial firms with multi-region exports. You need a fractional Head of AI Visibility — not a vendor.",
    description:
      "Embedded fractional Head of AI Visibility. Everything in AI Authority, plus we operate across multiple markets, run an active digital PR programme (target 1-2 placements/month), book you on industry podcasts, pitch by-lines to industry publications, build a custom AI visibility dashboard, and run quarterly strategy off-sites. Weekly executive sync. Direct WhatsApp.",
    receives: [
      "Everything in AI Authority (in primary market)",
      "Multi-region presence: SA + UK and/or US localized citations, reviews, schema, content",
      "Active digital PR programme (HARO + targeted journalist pitches): 1-2 placements/month target",
      "Podcast guest booking pipeline (industry podcasts): 1-2 bookings/quarter",
      "Industry publication by-lines / contributions: 1 ghost-written by-line/quarter",
      "Speaking gig pipeline (industry conferences, events)",
      "Awards & recognition campaign management",
      "Custom AI visibility dashboard (built around YOUR specific metrics)",
      "Weekly 30-min executive sync (vs monthly in AI Authority)",
      "Quarterly strategy off-site day (4 hrs deep work, in-person if SA or virtual)",
      "Direct WhatsApp access during business hours",
      "Annual brand audit + competitive intelligence deep-dive",
      "First-look access to new tools and methods I'm building",
      "Priority custom integrations as your business grows",
    ],
    monthlyWork: {
      intro:
        "100-160 hours of specialist + strategic work each month. The work mix tilts heavier toward strategy and partner-level engagement.",
      items: [
        { task: "Everything in AI Authority (articles, LinkedIn, citations, reviews, YouTube)", effort: "60-100 hrs" },
        { task: "Multi-region content + citation localisation", effort: "8-15 hrs" },
        { task: "Active PR programme (HARO + journalist pitches + placements)", effort: "10-15 hrs" },
        { task: "Podcast / speaking pipeline management", effort: "3-5 hrs" },
        { task: "By-line ghost-writing + pitching to industry publications", effort: "4-6 hrs" },
        { task: "Custom dashboard build + maintenance", effort: "6-10 hrs" },
        { task: "Weekly executive sync (4-5 syncs/month)", effort: "4-5 hrs" },
        { task: "Quarterly off-site prep + delivery (averaged monthly)", effort: "3-4 hrs" },
      ],
      notSocialMedia:
        "This is fractional executive partnership. I act as your strategic AI visibility partner with technical execution built in. No Instagram, no TikTok — the buyer/patient/client base for medical, legal, and industrial mid-market doesn't make decisions there. We focus where decisions actually happen: LinkedIn, industry pubs, expert citations, AI engines, search.",
    },
    comparableTo:
      "A fractional CMO or Head of Growth: R40-80k/mo in SA, $8-15k/mo in US. A senior in-house marketer + agency stack: R60k+/mo combined. A boutique PR firm + AEO consultancy combined: R30-50k/mo. We do this for less than half — and execution is built in, not outsourced.",
    roiMath: {
      breakEven:
        "1 mid-size B2B contract per year (R250k+). For medical groups: 5-10 new high-value patients/year. For law firms: 1-2 enterprise matters/year. For industrial: 1-2 multi-region contracts/year.",
      targetReturn:
        "Annual cost: R240,000. Realistic for mid-market B2B industrial: 2-5 enterprise wins × R250k+ = R500k-R1.25M. For medical groups: 100-300 new patients × R5k average = R500k-R1.5M. For law firms: 10-25 new matters × R100k = R1M-R2.5M. 3-10× ROI in year 1.",
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
