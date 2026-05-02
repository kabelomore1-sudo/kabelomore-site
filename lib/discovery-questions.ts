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
    title: "Who you are",
    description: "Just enough to identify you and tailor the questions to your sector.",
  },
  2: {
    title: "What you sell",
    description:
      "We need to know your services to know what AI engines should recommend you for.",
  },
  3: {
    title: "Who you serve",
    description:
      "Your ideal customer + service area drives every visibility decision.",
  },
  4: {
    title: "Who you compete with",
    description:
      "We benchmark against real competitors — the ones AI engines surface, not the ones at industry events.",
  },
  5: {
    title: "What you want to rank for",
    description:
      "The exact queries you wish your customers searched and found you for.",
  },
  6: {
    title: "Where you stand today",
    description:
      "Quick honest snapshot of your current digital presence. We'll verify ourselves; we just want your read.",
  },
  7: {
    title: "Send the report",
    description:
      "We'll email you a personalised AEO Discovery summary within 24 hours.",
  },
};

export function getStepLabel(step: number) {
  return stepLabels[step] ?? { title: `Step ${step}`, description: "" };
}

export const discoveryQuestions: DiscoveryQuestion[] = [
  // STEP 1 — Identification
  {
    id: "businessName",
    step: 1,
    sector: "all",
    required: true,
    question: "What's the name of your business?",
    type: "text",
    placeholder: "e.g. Sandton Cardiology Practice",
    maxLength: 200,
  },
  {
    id: "websiteUrl",
    step: 1,
    sector: "all",
    required: false,
    question: "What's your website URL?",
    context: "If you don't have one yet, leave blank — that's part of what we'd address.",
    type: "url",
    placeholder: "https://yourfirm.co.za",
  },
  {
    id: "sector",
    step: 1,
    sector: "all",
    required: true,
    question: "Which sector best describes your firm?",
    context: "We'll tailor the rest of the questions to your sector.",
    type: "select",
    options: [
      { value: "medical", label: "Medical (practitioner, dentist, specialist, GP group, aesthetics)" },
      { value: "legal", label: "Legal (attorney, advocate, adviser, mid-market firm)" },
      { value: "industrial", label: "Industrial (B2B equipment, fabricator, contractor, BBBEE supplier)" },
      { value: "other", label: "Other / I'm not sure" },
    ],
  },

  // STEP 2 — Services
  {
    id: "services",
    step: 2,
    sector: "all",
    required: true,
    question: "What are your top 3 services?",
    context: "List the 3 you sell most, or 3 you'd like to sell more of.",
    type: "multi-text",
    multiLabels: ["Service 1", "Service 2", "Service 3"],
  },
  {
    id: "primaryService",
    step: 2,
    sector: "all",
    required: true,
    question: "Which of those would you most like to sell MORE of?",
    context: "We'll prioritise AEO work around this service.",
    type: "text",
    placeholder: "Type the service name",
  },
  {
    id: "averageDealSize",
    step: 2,
    sector: "all",
    required: true,
    question: "What's the average value of one customer or contract?",
    context: "Used for ROI math — and to recommend the right tier.",
    type: "range-select",
    options: [
      { value: "under-5k", label: "Under R5,000 per customer" },
      { value: "5-25k", label: "R5,000 – R25,000" },
      { value: "25-100k", label: "R25,000 – R100,000" },
      { value: "100-500k", label: "R100,000 – R500,000" },
      { value: "500k-plus", label: "Over R500,000" },
    ],
  },

  // STEP 3 — Customer & Geography
  {
    id: "idealCustomer",
    step: 3,
    sector: "all",
    required: true,
    question: "Describe your ideal customer in one sentence.",
    context:
      "Specific is better. 'Mid-market law firms in Johannesburg with 15-50 attorneys' beats 'businesses that need legal help.'",
    type: "textarea",
    placeholder: "e.g. Industrial procurement managers at SA mining houses sourcing BBBEE Level 1-2 suppliers",
    maxLength: 500,
  },
  {
    id: "serviceArea",
    step: 3,
    sector: "all",
    required: true,
    question: "Where do you serve customers?",
    context: "City / region / national / international.",
    type: "text",
    placeholder: "e.g. Pretoria + Johannesburg + Witbank",
    maxLength: 200,
  },

  // SECTOR-SPECIFIC questions inserted in step 3
  {
    id: "medicalAidPlans",
    step: 3,
    sector: "medical",
    required: false,
    question: "Which medical aid plans do you accept?",
    context: "If you accept Discovery, Bonitas, GEMS, etc. — list them. Critical for buyer-intent queries.",
    type: "textarea",
    placeholder: "e.g. Discovery, Bonitas, Momentum, GEMS",
    maxLength: 500,
  },
  {
    id: "hpcsaNumber",
    step: 3,
    sector: "medical",
    required: false,
    question: "HPCSA registration number?",
    context: "Optional — shown to AI engines as a verified credential.",
    type: "text",
    placeholder: "e.g. MP0123456",
    maxLength: 50,
  },
  {
    id: "lssaListing",
    step: 3,
    sector: "legal",
    required: false,
    question: "Are you listed on the Law Society of SA (LSSA) directory?",
    type: "select",
    options: [
      { value: "listed-current", label: "Yes — listed and current" },
      { value: "listed-stale", label: "Yes — but listing might be out of date" },
      { value: "not-listed", label: "No, not listed" },
      { value: "unsure", label: "I'm not sure" },
    ],
  },
  {
    id: "practiceAreas",
    step: 3,
    sector: "legal",
    required: false,
    question: "What practice areas do you cover?",
    context: "List up to 5. The most specific ones rank best.",
    type: "textarea",
    placeholder: "e.g. Commercial litigation, M&A, Tech/SaaS contracts, Labour law (CCMA), Intellectual property",
    maxLength: 500,
  },
  {
    id: "bbbeeLevel",
    step: 3,
    sector: "industrial",
    required: false,
    question: "What's your BBBEE Level?",
    context: "Critical for SA enterprise + SOE procurement queries.",
    type: "select",
    options: [
      { value: "level-1", label: "Level 1 (highest)" },
      { value: "level-2", label: "Level 2" },
      { value: "level-3", label: "Level 3" },
      { value: "level-4", label: "Level 4" },
      { value: "level-5-plus", label: "Level 5 or below" },
      { value: "exempt", label: "Exempt micro-enterprise (EME)" },
      { value: "not-applicable", label: "Not BBBEE-relevant for our market" },
    ],
  },
  {
    id: "industrialCertifications",
    step: 3,
    sector: "industrial",
    required: false,
    question: "Which certifications or registrations do you hold?",
    context: "CSD, CIDB, ISO, sector-specific (NTC, MEMSA, etc.). List what applies.",
    type: "textarea",
    placeholder: "e.g. CSD MAAA1234567, CIDB Grade 5GB, ISO 9001:2015, NTC member",
    maxLength: 500,
  },

  // STEP 4 — Competition
  {
    id: "competitors",
    step: 4,
    sector: "all",
    required: true,
    question: "Who are your top 3 competitors?",
    context: "URLs preferred. Names work if you don't know the website. We benchmark you against them.",
    type: "multi-text",
    multiLabels: ["Competitor 1", "Competitor 2", "Competitor 3"],
  },
  {
    id: "competitorAdvantage",
    step: 4,
    sector: "all",
    required: false,
    question: "What's the ONE thing they do better than you?",
    context: "Brutal honesty here is more useful than diplomacy.",
    type: "textarea",
    placeholder: "e.g. They post on LinkedIn 3× per week. Our founder doesn't post.",
    maxLength: 500,
  },

  // STEP 5 — Visibility goals
  {
    id: "wishedQueries",
    step: 5,
    sector: "all",
    required: true,
    question:
      "What queries do you WISH your customers searched and found you for? List 3-5.",
    context:
      "These become the queries we test on ChatGPT, Claude, Gemini, and Perplexity. Examples: 'Best cardiologist in Sandton accepting Discovery,' 'BBBEE Level 1 lifting equipment supplier mining,' 'Commercial attorney for SaaS startups Cape Town.'",
    type: "textarea",
    placeholder: "One query per line",
    maxLength: 1000,
  },
  {
    id: "successMetric",
    step: 5,
    sector: "all",
    required: true,
    question: "What does success look like 6 months from now?",
    context: "Specific is better. '10 new patient bookings/week from AI search' beats 'more visibility.'",
    type: "textarea",
    placeholder: "e.g. 5 new mid-market law firm clients found via AI, average matter R200k each",
    maxLength: 500,
  },

  // STEP 6 — Current state
  {
    id: "currentDiscoverySources",
    step: 6,
    sector: "all",
    required: true,
    question: "Where do customers find you today?",
    context: "Tick all that apply. Honest answer.",
    type: "multi-select",
    options: [
      { value: "google-organic", label: "Google search (organic)" },
      { value: "google-paid", label: "Google ads (paid)" },
      { value: "gbp", label: "Google Business Profile / Maps" },
      { value: "linkedin", label: "LinkedIn" },
      { value: "industry-directory", label: "Industry directory listings" },
      { value: "word-of-mouth", label: "Word of mouth / referrals" },
      { value: "ai-engine", label: "AI engines (ChatGPT, Claude, etc.)" },
      { value: "social-other", label: "Other social media" },
      { value: "trade-publications", label: "Trade publications / press" },
      { value: "i-dont-know", label: "Honestly, I don't know" },
    ],
  },
  {
    id: "currentDigitalSetup",
    step: 6,
    sector: "all",
    required: true,
    question: "What's your current digital setup?",
    context: "Tick everything that's true today.",
    type: "multi-select",
    options: [
      { value: "gbp-claimed", label: "Google Business Profile is claimed and active" },
      { value: "schema-deployed", label: "We have schema markup on our website" },
      { value: "linkedin-active", label: "We post on LinkedIn at least weekly" },
      { value: "reviews-managed", label: "We actively respond to reviews" },
      { value: "hellopeter-claimed", label: "We've claimed our HelloPeter profile" },
      { value: "industry-citations", label: "We're listed on industry-specific directories" },
      { value: "newsletter-running", label: "We send a regular newsletter" },
      { value: "youtube-active", label: "We have a YouTube channel with content" },
      { value: "none-of-above", label: "None of the above (or honestly not sure)" },
    ],
  },
  {
    id: "previousAttempts",
    step: 6,
    sector: "all",
    required: false,
    question: "What have you tried before — what worked, what didn't?",
    context:
      "Past SEO agencies, freelancers, tools, courses. Telling us what failed prevents us from repeating it.",
    type: "textarea",
    placeholder: "e.g. Hired SEO agency in 2024 — got generic blog posts, no leads. LinkedIn ads tried — too expensive for our deal size.",
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
    question: "Email to send your AEO Discovery summary to?",
    context:
      "We'll email you a personalised summary within 24 hours. No spam. Easy unsubscribe.",
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
