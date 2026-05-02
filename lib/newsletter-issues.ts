/**
 * The AEO Letter — newsletter issue archive
 *
 * Each issue is a public web page (/newsletter/[slug]) so it's:
 *   - Indexed by Google + AI engines (compounding citation source)
 *   - Shareable beyond subscribers (each issue can spread on its own merit)
 *   - Search-able (subscribers refer back; AI engines link to it)
 *
 * Editorial structure for each issue:
 *   - One pattern from a real audit (anonymised if needed)
 *   - One specific fix (with exact steps)
 *   - One quotable insight (LinkedIn-shareable)
 *
 * To publish a new issue: add an entry to issuesArr below. The /newsletter
 * archive route picks it up automatically.
 *
 * Future: migrate to MDX files (mirror /content/blog) once weekly cadence
 * justifies the editorial workflow upgrade.
 */

export type NewsletterIssue = {
  slug: string;
  number: number;
  /** ISO 8601 date */
  date: string;
  title: string;
  subtitle: string;
  /** Sector tag for filtering — 'general' for cross-sector */
  sector: "medical" | "legal" | "industrial" | "general";
  /** Plain-text body, paragraphs separated by blank lines */
  body: string[];
  /** Closing CTA (auto-rendered) */
  cta?: { text: string; href: string };
};

const issuesArr: NewsletterIssue[] = [
  {
    slug: "welcome-the-real-estate-method",
    number: 0,
    date: "2026-05-02",
    title:
      "Welcome to The AEO Letter — and The Real Estate Method.",
    subtitle:
      "Issue 0 · Why we name the work, and what to expect from this newsletter every Thursday.",
    sector: "general",
    body: [
      "If you're reading this, you've signed up — thank you. Quick framing before we get to the work.",

      "Most AEO advice in 2026 is single-channel: 'just fix your schema,' 'just post on LinkedIn,' 'just get more reviews.' All of that is true. None of it is the whole story.",

      "The whole story is what I call **The Real Estate Method** — covering all 7 properties AI engines actually harvest from, in priority order, weighted to your sector. The properties are: Website + Schema, Google Business Profile, LinkedIn (founder + company), industry citations, reviews velocity, industry press, and AI engine tracking.",

      "Why name it? Because by 2027 every freelance marketer will claim 'we do AEO.' The defensible position is to own a named, documented, reproducible framework. Naval Ravikant's frame on this is sharp: 'Specific knowledge, attached to a name, is a moat.' That's the bet.",

      "**What every issue will deliver:** one pattern from a real audit I just ran (anonymised), one specific fix (with the exact steps), one quotable insight you can share with colleagues. Always Thursday morning SA time. Always one email. Never a 'limited offer.'",

      "**For new readers:** if you haven't read the sector checklists yet, they're the fastest way to understand what The Real Estate Method actually looks like applied to your industry. 47 specific checks each, public and free at kabelomore.com/resources.",

      "**For existing audit clients:** your monthly tracker now also feeds these issues. When a pattern emerges across three or more audits in a quarter, it becomes a newsletter — and your audit becomes part of the body of work that compounds (anonymised, of course).",

      "Issue 1 lands next Thursday. It walks through one industrial audit from last week — the firm went from 0 AI citations to 4 in 21 days by fixing one schema property. The exact steps will be in the email.",

      "Talk soon.",

      "— Kabelo",
    ],
    cta: {
      text: "Read the sector checklists →",
      href: "/resources",
    },
  },
];

export const newsletterIssues = issuesArr.sort((a, b) => b.number - a.number);

export function getNewsletterIssue(slug: string): NewsletterIssue | null {
  return newsletterIssues.find((i) => i.slug === slug) ?? null;
}
