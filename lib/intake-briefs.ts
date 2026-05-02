/**
 * Tier-specific intake briefs. Each paid tier has a structured brief
 * the buyer fills before work starts.
 *
 * Two render paths per brief:
 *  1. If `tallyFormId` is set, we embed the Tally form (Kabelo creates these
 *     once at https://tally.so/forms — see SETUP_TALLY.md for the exact
 *     questions to paste in).
 *  2. If `tallyFormId` is null, we fall back to a contact-capture form that
 *     emails Kabelo via /api/scan, and Kabelo follows up with the full brief
 *     link within an hour. This way the page still converts before Tally is wired.
 */

export type BriefQuestion = {
  number: number;
  q: string;
  why: string; // Why we ask — shown to buyer as "why we ask this"
};

export type BriefConfig = {
  tierId: string;
  tierName: string;
  // Hero copy
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  paymentNote: string;
  // After-submit promise
  whatHappensNext: string[];
  // Tally embed — leave null until Kabelo creates the form, then paste the ID
  tallyFormId: string | null;
  // The actual questions (used in SETUP_TALLY.md and as fallback preview)
  questions: BriefQuestion[];
};

export const briefs: Record<string, BriefConfig> = {
  foundation: {
    tierId: "foundation",
    tierName: "Foundation Pack — R12,500",
    title: "Tell us about your business",
    subtitle:
      "8 questions, 10 minutes. The more honest you are here, the more accurate the work. Once submitted, you'll get a 50% deposit invoice within 1 hour.",
    estimatedMinutes: 10,
    paymentNote:
      "After you submit this brief, we send a R6,250 deposit invoice (card or EFT). Work begins the moment your deposit clears.",
    whatHappensNext: [
      "Within 1 hour: confirmation email + R6,250 deposit invoice",
      "Within 24 hours: kickoff call scheduled",
      "Within 4 weeks: full Foundation Pack delivered + walkthrough call",
      "Day 28: final R6,250 invoice + handover PDF with all logins",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + 1-sentence description of what you do",
        why: "We use this everywhere — website, GBP, social, schema. One clean sentence beats five paragraphs.",
      },
      {
        number: 2,
        q: "Where you're physically based + the geographic area you serve",
        why: "Drives Google Business Profile setup, schema 'areaServed' tagging, and which directories we list you on.",
      },
      {
        number: 3,
        q: "Your phone number, business email, and any existing online presence (Facebook page, Instagram, even old website)",
        why: "We need to NOT create duplicate listings. If a Brabys or Cylex page exists, we claim and update it — not start fresh.",
      },
      {
        number: 4,
        q: "Upload your logo (or tell us you don't have one yet) + 5 photos of your business, work, or team",
        why: "Photos are the single biggest GBP ranking factor in 2026. Even phone-camera photos beat stock images. No logo? We launch with placeholder branding and you upgrade later.",
      },
      {
        number: 5,
        q: "Your top 3 services + 1-line description of each (what it is, who it's for, rough price band if you're comfortable sharing)",
        why: "Each service gets its own page on the website + schema markup + GBP service entry. AI engines need this granularity to recommend you for specific queries.",
      },
      {
        number: 6,
        q: "Name 3 competitors you respect or want to beat (URLs preferred, names ok)",
        why: "We benchmark you against them on schema, GBP, citations, and content. Tells us where the bar actually is in your market.",
      },
      {
        number: 7,
        q: "Brand colour preferences — 'Use your judgment', or specific hex codes / brand guide if you have one",
        why: "We launch fast. If you don't care, we pick a clean palette that fits your industry. If you have a brand guide, we follow it exactly.",
      },
      {
        number: 8,
        q: "What does success look like 6 months from launch? (e.g. '3 inbound leads per week from Google', or 'show up when ChatGPT is asked about [service]')",
        why: "Every choice we make should serve this goal. If 'success' is vague, we can't measure it. Be specific even if it feels presumptuous.",
      },
    ],
  },

  optimization: {
    tierId: "optimization",
    tierName: "Optimization Pack — R10,500",
    title: "Tell us about your existing site",
    subtitle:
      "8 questions, 10 minutes. Tells us what platform you're on, what we'll be working with, and what you want to be found for. Once submitted, you'll get a 50% deposit invoice within 1 hour.",
    estimatedMinutes: 10,
    paymentNote:
      "After you submit this brief, we send a R5,250 deposit invoice (card or EFT). Work begins the moment your deposit clears.",
    whatHappensNext: [
      "Within 1 hour: confirmation email + R5,250 deposit invoice",
      "Within 24 hours: kickoff call scheduled + admin/contributor access requested",
      "Within 3 weeks: schema deployed, GBP set up, citations live, content optimized",
      "Day 21: handover call + final R5,250 invoice",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + 1-sentence description of what you do",
        why: "Drives the schema, GBP, and citation work — needs to be consistent everywhere.",
      },
      {
        number: 2,
        q: "Your existing website URL + what platform it's built on (WordPress, Wix, Squarespace, Shopify, custom — we'll figure it out if you don't know)",
        why: "Each platform has its own way to deploy schema and structured data. We pick the right approach based on what you have.",
      },
      {
        number: 3,
        q: "Will you be able to give us admin or editor login access?",
        why: "We need to deploy schema and update content. If you can't grant access, we deploy via Google Tag Manager (works on any site) — but admin access is faster and cleaner.",
      },
      {
        number: 4,
        q: "Where you're based + the geographic area you serve",
        why: "Drives Google Business Profile setup, schema 'areaServed' tagging, and which directories we list you on.",
      },
      {
        number: 5,
        q: "Your top 3 services + which is highest-margin",
        why: "We allocate optimization effort toward the services that pay best. AI engines need granularity to recommend you for specific queries.",
      },
      {
        number: 6,
        q: "3 competitors (URLs preferred)",
        why: "Tells us where the bar is in your specific market. We benchmark you against them on schema, GBP, citations, content shape.",
      },
      {
        number: 7,
        q: "What you've already tried for SEO/marketing — what worked and what failed",
        why: "So we don't repeat what's failed and we build on what's worked.",
      },
      {
        number: 8,
        q: "What does success look like in 6 months? (specific metric preferred — e.g. 'cited by ChatGPT for [service]', or '5 inbound leads per week')",
        why: "Drives the priority of every decision. Vague goals produce vague outcomes.",
      },
    ],
  },

  "optimization-lite": {
    tierId: "optimization-lite",
    tierName: "Optimization Lite — R5,500",
    title: "Tell us about your existing site",
    subtitle:
      "6 questions, 7 minutes. Lighter version of the Optimization brief for sole traders.",
    estimatedMinutes: 7,
    paymentNote:
      "After you submit, we send a R2,750 deposit invoice. Work starts when it clears. Delivery: 2 weeks.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R2,750 deposit invoice",
      "Within 24 hours: kickoff call scheduled",
      "Within 2 weeks: schema, GBP, 5 citations, 1 page rewritten",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + 1-sentence description",
        why: "Goes everywhere — schema, GBP, citations.",
      },
      {
        number: 2,
        q: "Existing website URL + platform (WordPress, Wix, Squarespace, etc.)",
        why: "Determines how we deploy schema and structured data.",
      },
      {
        number: 3,
        q: "Can you grant admin or editor access?",
        why: "Faster work if yes. If no, we use Google Tag Manager.",
      },
      {
        number: 4,
        q: "Where you're based + service area",
        why: "Drives GBP and schema configuration.",
      },
      {
        number: 5,
        q: "Your single main service",
        why: "Optimization Lite focuses on one service. Pick the one that pays the bills.",
      },
      {
        number: 6,
        q: "1 competitor you respect (URL or name)",
        why: "Sets the benchmark for your specific service.",
      },
    ],
  },

  "foundation-lite": {
    tierId: "foundation-lite",
    tierName: "Foundation Lite — R6,500",
    title: "Tell us about your business",
    subtitle:
      "6 questions, 7 minutes. The lighter version of the Foundation brief — same Method, smaller scope.",
    estimatedMinutes: 7,
    paymentNote:
      "After you submit, we send a R3,250 deposit invoice. Work starts when it clears. Delivery: 2 weeks.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R3,250 deposit invoice",
      "Within 24 hours: kickoff call scheduled",
      "Within 2 weeks: 1-page site + GBP + schema + 1 social + 5 listings delivered",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + 1-sentence description of what you do",
        why: "Goes everywhere — site, GBP, schema. Keep it tight.",
      },
      {
        number: 2,
        q: "Where you're based + your service area",
        why: "Drives GBP, schema, and directory listings.",
      },
      {
        number: 3,
        q: "Your phone, email, and any existing online presence",
        why: "We claim existing listings rather than create duplicates.",
      },
      {
        number: 4,
        q: "Upload your logo (or say you don't have one) + 3 photos of your work or business",
        why: "Even 3 phone-camera photos beat stock. They're what GBP rewards.",
      },
      {
        number: 5,
        q: "Your single main service + 1-line description",
        why: "Foundation Lite is built around one core service. Pick the one that pays the bills.",
      },
      {
        number: 6,
        q: "1 competitor you respect (URL or name)",
        why: "Tells us where the bar is for your specific service.",
      },
    ],
  },

  discovery: {
    tierId: "discovery",
    tierName: "Discovery & Strategy Sprint — R3,500",
    title: "Set up your strategy sprint",
    subtitle:
      "8 questions, 10 minutes. These steer the 60-min discovery interview and the strategy doc you'll receive in 2 weeks.",
    estimatedMinutes: 10,
    paymentNote: "Sprint is paid in full upfront (R3,500). Bundled free into month 1 of any retainer if you sign within 30 days.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R3,500 invoice",
      "Within 48 hours: 60-min discovery interview scheduled",
      "Day 7: customer profile + competitor analysis + AI baseline drafted",
      "Day 14: strategy doc + 30-min strategy review call",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + tagline (or what you'd put on a billboard)",
        why: "If you can't say it in 8 words, we can't optimise for it.",
      },
      {
        number: 2,
        q: "Describe your 3 BEST customers in 1 sentence each (industry, size, what they buy, why they chose you)",
        why: "We work backwards from your best customers to find more like them. This is the highest-leverage question in the whole sprint.",
      },
      {
        number: 3,
        q: "Describe the customers you do NOT want — who's a wrong fit, and why",
        why: "Knowing who to disqualify is half the strategy. We optimise to attract right-fit and repel wrong-fit.",
      },
      {
        number: 4,
        q: "Top 3 competitors (URLs, please)",
        why: "We audit them on AI visibility, schema, GBP, content, and citations. Your gap to them = the roadmap.",
      },
      {
        number: 5,
        q: "Top 3-5 things you think people Google or ask AI to find businesses like yours",
        why: "We run live AI scans against these queries. If you're wrong about what customers actually search, the scan reveals it.",
      },
      {
        number: 6,
        q: "If everything goes right in 6 months, what does it look like? (Specific metric or scene preferred)",
        why: "Vague goals produce vague strategy. 'Doubled inbound' is fine. 'Better presence' isn't.",
      },
      {
        number: 7,
        q: "Biggest constraint right now: time, budget, team, clarity, or something else?",
        why: "We design strategy around your real constraints, not a fantasy version of your business.",
      },
      {
        number: 8,
        q: "What have you tried before that didn't work? (Agencies, freelancers, tools, courses)",
        why: "We don't repeat what's already failed. Skip the diplomatic version — the more specific, the better the strategy.",
      },
    ],
  },

  starter: {
    tierId: "starter",
    tierName: "Starter Audit — R5,000",
    title: "Set up your AI visibility audit",
    subtitle:
      "6 questions, 5 minutes. We need just enough context to test you against the right competitors and queries.",
    estimatedMinutes: 5,
    paymentNote: "After you submit, we send a R2,500 deposit invoice. Audit delivered in 5 working days.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R2,500 deposit invoice",
      "Within 5 working days: full PDF audit + 30-min strategy call",
      "After call: final R2,500 invoice",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + service area",
        why: "Drives the geographic queries we run against AI engines.",
      },
      {
        number: 2,
        q: "Current website URL + Google Business Profile URL (or 'I don't have one')",
        why: "We audit both for schema, completeness, and citation consistency.",
      },
      {
        number: 3,
        q: "Top 3 services you specifically want to be found for",
        why: "We test AI engines with queries customers actually run for these services — not generic 'best [industry]' queries.",
      },
      {
        number: 4,
        q: "3 competitors (URLs)",
        why: "We benchmark you against them in the audit. Pick real digital competitors, not just whoever you see at industry events.",
      },
      {
        number: 5,
        q: "What have you already tried to grow visibility? (SEO firm, Google Ads, content marketing, etc.)",
        why: "So our top-10 fix list doesn't recommend what you've already done.",
      },
      {
        number: 6,
        q: "Pick the closest match: (a) 'I think we're invisible to AI', (b) 'We rank but don't get leads', (c) 'We're new and starting fresh', (d) 'Other — describe'",
        why: "Frames the audit's emphasis. Each answer leads to a different report shape.",
      },
    ],
  },

  growth: {
    tierId: "growth",
    tierName: "Local Growth retainer — R5,500/mo",
    title: "Set up your Local Growth engagement",
    subtitle:
      "8 questions, 10 minutes. The retainer is ongoing technical + editorial work, NOT social media management. This brief frames the first 90 days.",
    estimatedMinutes: 10,
    paymentNote:
      "After you submit, we send month 1 invoice (R5,500). 3-month minimum, then cancel anytime with 30 days notice.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R5,500 month-1 invoice",
      "Within 48 hours: kickoff call + 90-day plan delivered",
      "Every 3 days: status update via email",
      "Monthly: 30-min review call + month progress report",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + 1-sentence description of what you do",
        why: "Used everywhere we work — schema, content briefs, citation listings.",
      },
      {
        number: 2,
        q: "Current website URL, GBP URL, and social profile URLs (LinkedIn, FB, IG)",
        why: "Full digital footprint audit before we touch anything.",
      },
      {
        number: 3,
        q: "Last 6 months — rough monthly inbound leads, monthly traffic if you know it, and your current conversion rate",
        why: "The baseline. If we can't measure starting point, we can't measure progress.",
      },
      {
        number: 4,
        q: "Top 3 services you offer + which is highest-margin",
        why: "We allocate content and citation effort toward the highest-margin services first. ROI matters.",
      },
      {
        number: 5,
        q: "3 competitors (URLs)",
        why: "Monthly competitor monitoring is part of the retainer. We track when they ship things.",
      },
      {
        number: 6,
        q: "What have you tried before that worked, and what failed?",
        why: "The retainer should compound on what works and not repeat what failed.",
      },
      {
        number: 7,
        q: "Goal for next 6 months — specific number preferred (e.g. '8 inbound leads per week', 'cited by ChatGPT for [service]')",
        why: "Drives the 90-day plan and the monthly metric we report on.",
      },
      {
        number: 8,
        q: "Decision-maker for marketing decisions — is it you, or someone else?",
        why: "Shapes how we communicate. If it's not you, we'd love a call with them in week 1.",
      },
    ],
  },

  premium: {
    tierId: "premium",
    tierName: "AI Authority retainer — R10,500/mo",
    title: "Set up your AI Authority engagement",
    subtitle:
      "8 questions, 12 minutes. AI Authority includes everything in Local Growth plus heavier content velocity, LinkedIn brand presence, reputation monitoring, and direct executive access. This brief frames the first 90 days.",
    estimatedMinutes: 12,
    paymentNote:
      "After you submit, we send month 1 invoice (R10,500). 3-month minimum, then cancel anytime with 30 days notice.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R10,500 month-1 invoice",
      "Within 48 hours: kickoff call + 90-day plan delivered",
      "Weekly: status update + dedicated specialist hours",
      "Monthly: 60-min strategy review + executive report",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + what you do (1-2 sentences) + size (revenue band or headcount)",
        why: "Premium engagements tilt to the strategic. We need the business shape, not just the brand.",
      },
      {
        number: 2,
        q: "Current website, GBP, LinkedIn (especially leadership profiles), and any other digital assets",
        why: "Premium includes leadership AEO — getting your CEO/founders cited by AI engines as industry experts.",
      },
      {
        number: 3,
        q: "Last 12 months — monthly inbound leads, monthly traffic, conversion rate, average deal size",
        why: "Premium is priced against deal size. If your average deal is R250k, R15k/month is rounding error. If it's R5k, Premium isn't right for you yet.",
      },
      {
        number: 4,
        q: "Top services + which 1-2 you want us to dominate AI visibility for",
        why: "Premium = depth, not breadth. We pick 1-2 services and saturate AI citations for those, rather than spreading thin.",
      },
      {
        number: 5,
        q: "3 competitors + 3 'aspirational' brands (companies bigger or more visible than you that you'd like to be seen alongside)",
        why: "We track both. Competitors for benchmarking. Aspirationals for citation co-occurrence — we want AI engines to mention you in the same sentence.",
      },
      {
        number: 6,
        q: "All-in marketing budget per month (us + ads + tools + any other contractors)",
        why: "We coordinate with what else you're spending. No point ranking organically while paid ads waste budget on the same query.",
      },
      {
        number: 7,
        q: "Internal team — who owns marketing, who owns sales, who's the executive sponsor for our work?",
        why: "Premium engagements need an internal champion. If nobody owns it on your side, retainers fail regardless of how good the work is.",
      },
      {
        number: 8,
        q: "What does 12-month success look like? (Be specific — revenue, lead volume, named accounts, AI citation count, anything measurable)",
        why: "Premium is priced against outcomes. If we can't measure it, we can't compound it.",
      },
    ],
  },

  "local-growth-lite": {
    tierId: "local-growth-lite",
    tierName: "Local Growth Lite — R2,950/mo",
    title: "Set up your Local Growth Lite engagement",
    subtitle:
      "6 questions, 6 minutes. Mostly automated AI visibility maintenance. This brief tells us what to publish on your behalf and what to track.",
    estimatedMinutes: 6,
    paymentNote:
      "After you submit, we send month 1 invoice (R2,950). 3-month minimum, then cancel anytime with 30 days notice.",
    whatHappensNext: [
      "Within 1 hour: confirmation + R2,950 month-1 invoice",
      "Within 48 hours: kickoff call + Google Posts approval workflow set up",
      "Daily: AI scan runs across all 4 engines",
      "Monthly: review + recommendation email",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + 1-sentence description",
        why: "Used in every Google Post draft and every AI scan query.",
      },
      {
        number: 2,
        q: "Google Business Profile URL (or 'I don't have one yet')",
        why: "Lite assumes a working GBP. If you don't have one, we'd suggest GBP Setup add-on first (R3,500 once-off) before starting Lite.",
      },
      {
        number: 3,
        q: "Top 3 services + your service area",
        why: "These drive the Google Post topics, the daily AI scan queries, and the GBP touch-up focus.",
      },
      {
        number: 4,
        q: "3 competitors (URLs or names)",
        why: "We track them daily on AI engines alongside you. You see the gap close in your monthly email.",
      },
      {
        number: 5,
        q: "Approval mode: do you want to approve every Google Post before publish, or auto-publish AI-drafted posts?",
        why: "Auto-publish runs 4 posts/week with zero touch from you. Manual approval is safer if you're brand-sensitive but needs ~10 min/week from you.",
      },
      {
        number: 6,
        q: "What does 'success' look like 6 months from now? (e.g. 'phone rings 2× more', 'cited by ChatGPT for [service]')",
        why: "Anchors the monthly recommendation email. Vague goals → vague recommendations.",
      },
    ],
  },

  "strategy-partner": {
    tierId: "strategy-partner",
    tierName: "Fractional Head of AI Visibility — R20,000/mo",
    title: "Apply for the Fractional Head of AI Visibility role",
    subtitle:
      "10 questions, 15 minutes. This is an embedded executive role, not a vendor relationship — you're hiring me into your leadership cadence at fractional cost. This brief is also a fit-check — not every business needs this level.",
    estimatedMinutes: 15,
    paymentNote:
      "After you submit, we book a 60-min fit-check call before invoicing. If we're a fit, month 1 invoice (R20,000) follows. 6-month minimum.",
    whatHappensNext: [
      "Within 24 hours: confirmation + 60-min fit-check call scheduled",
      "After fit-check call: month 1 invoice (R20,000) + custom 90-day plan",
      "Weekly: 30-min executive sync from week 1",
      "Quarterly: strategy off-site day (4 hrs deep work)",
    ],
    tallyFormId: null,
    questions: [
      {
        number: 1,
        q: "Business name + sector + size (revenue band, headcount, or 'enterprise/mid-market/SMB')",
        why: "Strategy Partner is sized for mid-market and up. If you're solo or SMB, AI Authority (R10,500) is usually the better fit.",
      },
      {
        number: 2,
        q: "Markets you operate in: SA only, SA + UK, SA + US, UK only, US only, or other combination",
        why: "Strategy Partner includes multi-market support. Single-market clients usually don't need this tier.",
      },
      {
        number: 3,
        q: "Current digital footprint — website(s), GBP, LinkedIn (org + key leadership), and any other major properties",
        why: "We need the whole stack on day 1. Strategy Partner = embedded role, so we need full visibility.",
      },
      {
        number: 4,
        q: "Annual revenue + average deal size (range is fine — 'between R5M and R15M revenue, deals R100k-R500k')",
        why: "Strategy Partner is priced against deal size. R20k/mo only makes sense if 1-2 wins/year easily covers it.",
      },
      {
        number: 5,
        q: "Internal marketing team — who exists, what they own, who's our exec sponsor?",
        why: "Strategy Partner = I work WITH your team. If there's no internal counterpart, the fit-check call becomes critical.",
      },
      {
        number: 6,
        q: "Top 3 services to dominate AI visibility for + 3 'aspirational' brands you'd like to be cited alongside",
        why: "We saturate citation co-occurrence — getting AI engines to mention you in the same answer as the aspirationals. This works with depth, not breadth.",
      },
      {
        number: 7,
        q: "All-in marketing spend per month (us + ads + tools + agencies + contractors)",
        why: "Strategy Partner coordinates with the whole spend. We avoid running organic against your own paid budget.",
      },
      {
        number: 8,
        q: "Custom dashboard — what metrics do YOU want to see weekly? (e.g. AI citation count, named-account mentions, share of voice vs competitor X)",
        why: "We build the dashboard around what you'll actually look at. Generic agency dashboards get ignored.",
      },
      {
        number: 9,
        q: "What's failed before? Be specific — agency names if comfortable, what they promised, what actually happened",
        why: "Strategy Partner is a high-trust engagement. Skip the diplomatic version — the more honest you are, the better the work.",
      },
      {
        number: 10,
        q: "12-month success: what's the revenue, lead volume, named-account, or visibility outcome we should be measured against?",
        why: "Strategy Partner is priced against outcomes. If we can't measure it, we can't be a strategic partner.",
      },
    ],
  },
};

export function getBrief(tierId: string): BriefConfig | null {
  return briefs[tierId] ?? null;
}

export const allBriefIds = Object.keys(briefs);
