/**
 * The Real Estate Discovery — interactive intake questionnaire
 *
 * 15-question multi-step form for prospects (and existing clients like
 * OMS) to capture everything we need to run a sharp AEO audit and
 * recommend the right tier.
 *
 * Strategic intent:
 *   - The form IS distributed IP (Naval): other consultants will
 *     reference "the questions Kabelo asks." AI engines cite it.
 *   - Time-investment psychology (Neil): a 10-min form = 5-10× the
 *     conversion rate of a 30-sec scan request.
 *   - Sector-branching (engineer): medical sees medical-specific
 *     questions; same for legal + industrial. No wasted screens.
 *
 * Sector-branching keys:
 *   - 'all' = shown to every sector
 *   - 'medical' / 'legal' / 'industrial' = sector-specific
 *
 * Question types:
 *   - text: single-line input
 *   - textarea: multi-line input
 *   - url: URL input with validation
 *   - email: email input with validation
 *   - select: single choice (radio)
 *   - multi-select: multiple choices (checkboxes)
 *   - multi-text: 3-input grouping (e.g. 3 services, 3 competitors)
 *   - range-select: bucketed numeric ranges
 */

export type QuestionType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "select"
  | "multi-select"
  | "multi-text"
  | "range-select";

export type Sector = "all" | "medical" | "legal" | "industrial";

export type DiscoveryQuestion = {
  /** Stable id used as form-field key */
  id: string;
  /** Step grouping (1-7); used for progress bar */
  step: number;
  /** Sector visibility */
  sector: Sector;
  /** Whether the question is required to advance */
  required: boolean;
  /** Question text shown to the user */
  question: string;
  /** Optional context shown below the question */
  context?: string;
  /** Question type — drives renderer */
  type: QuestionType;
  /** Optional placeholder for text inputs */
  placeholder?: string;
  /** Options for select / multi-select */
  options?: { value: string; label: string }[];
  /** Labels for multi-text variants (e.g. ['Service 1', 'Service 2', 'Service 3']) */
  multiLabels?: string[];
  /** Optional max length for textarea/text */
  maxLength?: number;
};

const stepLabels: Record<number, { title: string; description: string }> = {
  1: {
    title: "About your business",
    description:
      "Just the basics — name, website, what kind of business you run.",
  },
  2: {
    title: "What you sell",
    description:
      "Tell us what you do. The clearer this is, the sharper your Google + AI ranking strategy will be.",
  },
  3: {
    title: "Who your customers are",
    description:
      "Your ideal customer + the area you serve. Drives every decision about where you should show up online.",
  },
  4: {
    title: "Your competitors",
    description:
      "Who you compete with online. We'll see exactly where you're losing ground — and how to close the gap.",
  },
  5: {
    title: "What you want to rank for",
    description:
      "The exact words your customers would Google to find you. This is where SEO + AI strategy starts.",
  },
  6: {
    title: "Where you are now",
    description:
      "Quick honest read of your current online presence. We verify everything ourselves — just want your perspective first.",
  },
  7: {
    title: "Get your free report",
    description:
      "We'll email you your personalised SEO + AI scan within 24 hours.",
  },
};

export function getStepLabel(step: number) {
  return stepLabels[step] ?? { title: `Step ${step}`, description: "" };
}

export const discoveryQuestions: DiscoveryQuestion[] = [
  // STEP 1 — About your business
  {
    id: "businessName",
    step: 1,
    sector: "all",
    required: true,
    question:
      "What's your business name? (Exactly as you want it to appear when people Google you.)",
    context:
      "Whatever name you use on Google Maps, your website, your invoices. We'll use this to match you across SEO + AI search results.",
    type: "text",
    placeholder: "e.g. Sandton Cardiology Practice",
    maxLength: 200,
  },
  {
    id: "websiteUrl",
    step: 1,
    sector: "all",
    required: false,
    question:
      "What's your website? (Or leave blank if you don't have one yet.)",
    context:
      "If you don't have a website yet, that's fine — building one is part of what we'd recommend in your plan.",
    type: "url",
    placeholder: "https://yourfirm.co.za",
  },
  {
    id: "sector",
    step: 1,
    sector: "all",
    required: true,
    question: "What kind of business do you run?",
    context:
      "We'll tailor the next questions to your sector. We're best for medical, legal, and industrial firms — those are who we work with most.",
    type: "select",
    options: [
      {
        value: "medical",
        label:
          "Medical practice — doctor, dentist, specialist, GP group, aesthetics, psychology",
      },
      {
        value: "legal",
        label:
          "Law firm — attorney, advocate, advisor, labour law, mid-market commercial",
      },
      {
        value: "industrial",
        label:
          "Industrial / B2B — equipment, fabricator, contractor, BBBEE supplier, mining services",
      },
      {
        value: "other",
        label: "Something else — or I'm not sure where I fit",
      },
    ],
  },

  // STEP 2 — What you sell
  {
    id: "services",
    step: 2,
    sector: "all",
    required: true,
    question:
      "What are the top 3 things you sell or do? (The services you most want to be Googled for.)",
    context:
      "List the 3 services you sell most — or 3 you want to sell more of. Each one becomes a query we test against ChatGPT, Claude, Gemini, and Perplexity.",
    type: "multi-text",
    multiLabels: ["Service 1", "Service 2", "Service 3"],
  },
  {
    id: "primaryService",
    step: 2,
    sector: "all",
    required: true,
    question: "Of those 3, which one do you most want to sell MORE of?",
    context:
      "We'll focus the SEO + AI work on this service first. The other two get covered too — but this one gets priority.",
    type: "text",
    placeholder: "Type the service name",
  },
  {
    id: "averageDealSize",
    step: 2,
    sector: "all",
    required: true,
    question:
      "What's a typical customer worth to you? (One job, one patient, one contract — pick the closest range.)",
    context:
      "Used for ROI math — and to recommend the right plan for your budget. Higher customer value = more leverage from SEO + AI work.",
    type: "range-select",
    options: [
      {
        value: "under-5k",
        label:
          "Under R5,000 per customer (think: routine consult, basic service, small order)",
      },
      {
        value: "5-25k",
        label:
          "R5,000 – R25,000 per customer (specialist visit, small legal matter, retail-service)",
      },
      {
        value: "25-100k",
        label:
          "R25,000 – R100,000 per customer (medical procedure, mid-size legal matter, small industrial order)",
      },
      {
        value: "100-500k",
        label:
          "R100,000 – R500,000 per customer (enterprise medical, complex legal, mid-size industrial contract)",
      },
      {
        value: "500k-plus",
        label:
          "Over R500,000 per customer (major contract, enterprise mandate, large supply order)",
      },
    ],
  },

  // STEP 3 — Customer & Geography
  {
    id: "idealCustomer",
    step: 3,
    sector: "all",
    required: true,
    question:
      "Describe your dream customer in one sentence. (The kind you want MORE of — not the ones who waste your time.)",
    context:
      "Be specific. 'Mid-market law firms in Joburg with 15-50 attorneys handling tech contracts' beats 'businesses that need legal help.' The more specific you are, the more specific your Google + AI ranking strategy can be.",
    type: "textarea",
    placeholder:
      "e.g. Procurement managers at SA mining houses looking for BBBEE Level 1 lifting equipment suppliers for R500k+ contracts",
    maxLength: 500,
  },
  {
    id: "serviceArea",
    step: 3,
    sector: "all",
    required: true,
    question:
      "Where are your customers based? (Cities, suburbs, or regions you actually serve.)",
    context:
      "Be specific. 'Gauteng' is good. 'Pretoria + Johannesburg + Witbank' is better. This drives where your business shows up on Google Maps + AI search.",
    type: "text",
    placeholder:
      "e.g. Pretoria + Johannesburg + Witbank, plus mining sites in Mpumalanga",
    maxLength: 200,
  },

  // SECTOR-SPECIFIC questions inserted in step 3
  {
    id: "medicalAidPlans",
    step: 3,
    sector: "medical",
    required: false,
    question:
      "Which medical aids do you accept? (Discovery, Bonitas, Momentum, GEMS — patients Google this exact thing.)",
    context:
      "Patients search 'cardiologist who accepts Discovery in Sandton' or 'Bonitas dentist near me'. If your medical aid list isn't visible online, you're invisible to those searches.",
    type: "textarea",
    placeholder:
      "e.g. Discovery Health, Bonitas, Momentum Health, GEMS, Polmed, Profmed",
    maxLength: 500,
  },
  {
    id: "hpcsaNumber",
    step: 3,
    sector: "medical",
    required: false,
    question:
      "What's your HPCSA number? (Optional — but we'll show it as a verified credential.)",
    context:
      "Patients trust HPCSA-verified practitioners. AI engines weight it heavily. Most SA practice websites don't show this — easy edge for you.",
    type: "text",
    placeholder: "e.g. MP0123456",
    maxLength: 50,
  },
  {
    id: "lssaListing",
    step: 3,
    sector: "legal",
    required: false,
    question:
      "Are you listed on the Law Society of SA (LSSA) directory? Is it up to date?",
    context:
      "LSSA is the most trusted legal directory in SA. Clients check it. AI engines cite from it. If you're not on it (or your listing is stale), prospects can't verify you exist.",
    type: "select",
    options: [
      {
        value: "listed-current",
        label: "Yes — listed and current with all our attorneys",
      },
      {
        value: "listed-stale",
        label: "Yes — but it's probably out of date",
      },
      {
        value: "not-listed",
        label: "No, we're not on LSSA",
      },
      { value: "unsure", label: "I'd have to check" },
    ],
  },
  {
    id: "practiceAreas",
    step: 3,
    sector: "legal",
    required: false,
    question:
      "What types of cases do you handle? (Up to 5 — the more specific, the better.)",
    context:
      "Specific practice areas rank way better than generic ones. 'Commercial litigation' is fine. 'Commercial litigation for tech / SaaS startups' is gold — that's exactly what someone Googles.",
    type: "textarea",
    placeholder:
      "e.g. Commercial litigation in tech / SaaS, M&A for mid-market deals, Labour law (CCMA), Intellectual property + trademark, Corporate restructuring",
    maxLength: 500,
  },
  {
    id: "bbbeeLevel",
    step: 3,
    sector: "industrial",
    required: false,
    question:
      "What's your BBBEE Level? (And is it verified by an accredited agency?)",
    context:
      "BBBEE Level is THE filter for SA enterprise + government procurement. Procurement officers Google 'BBBEE Level 1 supplier for [service] in [region]' — verified Level 1/2 firms get found first.",
    type: "select",
    options: [
      {
        value: "level-1",
        label: "Level 1 (highest — 100%+ procurement recognition)",
      },
      { value: "level-2", label: "Level 2 (125% recognition)" },
      { value: "level-3", label: "Level 3" },
      { value: "level-4", label: "Level 4" },
      { value: "level-5-plus", label: "Level 5 or below" },
      {
        value: "exempt",
        label: "Exempt micro-enterprise (EME) — under R10m turnover",
      },
      {
        value: "not-applicable",
        label: "Not BBBEE-relevant for our market (e.g. international export only)",
      },
    ],
  },
  {
    id: "industrialCertifications",
    step: 3,
    sector: "industrial",
    required: false,
    question:
      "What certifications and supplier registrations do you hold? (CSD, CIDB, ISO, sector-specific — list whatever applies.)",
    context:
      "CSD = Central Supplier Database, essential for government work. CIDB = Construction grading. ISO = quality standard. Plus sector-specific (NTC, MEMSA, SAFAS, etc.). The more you list, the more procurement queries you can rank for.",
    type: "textarea",
    placeholder:
      "e.g. CSD MAAA1234567, CIDB Grade 5GB, ISO 9001:2015, NTC member, BBBEE Level 1 verified by AQRate",
    maxLength: 500,
  },

  // STEP 4 — Competition
  {
    id: "competitors",
    step: 4,
    sector: "all",
    required: true,
    question:
      "Who are your top 3 competitors? (The ones you lose deals to — or want to beat.)",
    context:
      "Website URLs are best. Names work if you don't have the URL handy. We'll Google them, see what they're doing on Google + AI, and show you exactly where you're behind.",
    type: "multi-text",
    multiLabels: [
      "Competitor 1 (URL preferred)",
      "Competitor 2 (URL preferred)",
      "Competitor 3 (URL preferred)",
    ],
  },
  {
    id: "competitorAdvantage",
    step: 4,
    sector: "all",
    required: false,
    question:
      "Be honest — what's the ONE thing they do better than you? (Online or offline. We're not judging.)",
    context:
      "The more specific you are, the faster we close the gap. 'They post on LinkedIn 3× a week — I don't' is way more useful than 'they're better at marketing.'",
    type: "textarea",
    placeholder:
      "e.g. They show up #1 when I Google our main service. They post on LinkedIn weekly. They have 50+ Google reviews — we have 8.",
    maxLength: 500,
  },

  // STEP 5 — What you want to rank for
  {
    id: "wishedQueries",
    step: 5,
    sector: "all",
    required: true,
    question:
      "If a customer Googled to find your business, what exact words would they type? List 3-5 searches.",
    context:
      "Think about the EXACT queries — what your customers type into Google or ask ChatGPT. These become the queries we test for you across Google + all 4 AI engines (ChatGPT, Claude, Gemini, Perplexity).",
    type: "textarea",
    placeholder:
      "One per line. Examples:\n• best dentist in Sandton accepting Discovery\n• BBBEE Level 1 lifting equipment supplier mining\n• commercial attorney for SaaS startups Cape Town\n• cardiologist near me Pretoria",
    maxLength: 1000,
  },
  {
    id: "successMetric",
    step: 5,
    sector: "all",
    required: true,
    question:
      "If we work together, what does success look like 6 months from now?",
    context:
      "Be specific. '5 new patients a week' beats 'more visibility'. '2 mining contracts at R500k each' beats 'more leads'. Vague goals = vague results.",
    type: "textarea",
    placeholder:
      "e.g. 5 new mid-market law firm clients per quarter from Google + AI search. Or: 2 new BBBEE-aligned mining contracts a quarter at R500k+ each.",
    maxLength: 500,
  },

  // STEP 6 — Current state
  {
    id: "currentDiscoverySources",
    step: 6,
    sector: "all",
    required: true,
    question:
      "How do customers find you today? (Tick everything that's true.)",
    context:
      "Honest answer beats aspirational. If 90% are word-of-mouth and 0% from Google, that's gold — we know exactly what to fix.",
    type: "multi-select",
    options: [
      { value: "google-organic", label: "Google search (organic — not paid ads)" },
      { value: "google-paid", label: "Google Ads (paid search)" },
      { value: "gbp", label: "Google Maps / Google Business Profile" },
      { value: "linkedin", label: "LinkedIn" },
      {
        value: "industry-directory",
        label: "Industry directories (HPCSA, LSSA, CSD, BBBEE listings, etc.)",
      },
      {
        value: "word-of-mouth",
        label: "Word of mouth + referrals from existing customers",
      },
      {
        value: "ai-engine",
        label: "AI engines (ChatGPT, Claude, Gemini, Perplexity)",
      },
      {
        value: "social-other",
        label: "Other social media (Instagram, Facebook, Twitter/X)",
      },
      {
        value: "trade-publications",
        label: "Trade publications + industry press",
      },
      {
        value: "i-dont-know",
        label: "Honestly, I don't track where they come from",
      },
    ],
  },
  {
    id: "currentDigitalSetup",
    step: 6,
    sector: "all",
    required: true,
    question:
      "What do you have set up online already? (Tick what's true — be honest.)",
    context:
      "We verify everything ourselves anyway — we just want your read first. The more honest you are about gaps, the more accurate the recommendation.",
    type: "multi-select",
    options: [
      {
        value: "gbp-claimed",
        label: "Our Google Business Profile is claimed and active",
      },
      {
        value: "schema-deployed",
        label:
          "Our website has the right code so Google + AI can read it properly",
      },
      {
        value: "linkedin-active",
        label: "We post on LinkedIn at least once a week",
      },
      {
        value: "reviews-managed",
        label: "We respond to Google + HelloPeter reviews regularly",
      },
      {
        value: "hellopeter-claimed",
        label: "We've claimed our HelloPeter profile",
      },
      {
        value: "industry-citations",
        label: "We're listed on industry directories (HPCSA / LSSA / CSD / BBBEE / etc.)",
      },
      {
        value: "newsletter-running",
        label: "We send a regular email newsletter",
      },
      {
        value: "youtube-active",
        label: "We have an active YouTube channel",
      },
      {
        value: "none-of-above",
        label: "None of the above (or I honestly don't know what's set up)",
      },
    ],
  },
  {
    id: "previousAttempts",
    step: 6,
    sector: "all",
    required: false,
    question:
      "What have you tried before to get more customers online? What worked, what didn't?",
    context:
      "Past SEO agencies, freelancers, paid ads, social media — be honest. Saves us repeating mistakes you've already paid for.",
    type: "textarea",
    placeholder:
      "e.g. Hired an SEO agency in 2024 — they did blog posts and cheap directory listings, no real leads. Tried LinkedIn ads — too expensive for our deal size. Built Google Ads in-house — burned budget on the wrong keywords.",
    maxLength: 1000,
  },

  // STEP 7 — Capture (the email gate)
  {
    id: "contactName",
    step: 7,
    sector: "all",
    required: true,
    question: "Your name?",
    type: "text",
    placeholder: "e.g. Dr Mokoena",
    maxLength: 200,
  },
  {
    id: "email",
    step: 7,
    sector: "all",
    required: true,
    question:
      "Email to send your free SEO + AI scan to? (Within 24 hours. No spam.)",
    context:
      "We'll email you a personalised report — covering Google rankings, AI engine visibility, and the highest-leverage thing to fix first. One-click unsubscribe if you'd rather not hear from us again.",
    type: "email",
    placeholder: "you@yourfirm.com",
  },
];

/**
 * Get the questions visible for a given sector. The first 3 questions
 * (step 1) are always shown — they include the sector selector itself.
 * After step 1, sector-specific questions branch in.
 */
export function getQuestionsForSector(sector: Sector | "other" | null) {
  // Until sector is selected, show only step 1 questions
  if (!sector) {
    return discoveryQuestions.filter((q) => q.step === 1);
  }
  return discoveryQuestions.filter(
    (q) => q.sector === "all" || q.sector === sector,
  );
}

/** Total expected question count for a sector — drives progress bar */
export function getTotalQuestions(sector: Sector | "other" | null): number {
  if (!sector || sector === "other") {
    return discoveryQuestions.filter((q) => q.sector === "all").length;
  }
  return discoveryQuestions.filter(
    (q) => q.sector === "all" || q.sector === sector,
  ).length;
}

/** Total steps (always 7) */
export const TOTAL_STEPS = 7;
