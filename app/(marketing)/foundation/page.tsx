import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { site, tiers } from "@/lib/site";
import {
  ArrowRight,
  Globe,
  MapPin,
  Code2,
  Share2,
  ListChecks,
  Mail,
  PhoneCall,
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const foundation = tiers.find((t) => t.id === "foundation")!;
const foundationLite = tiers.find((t) => t.id === "foundation-lite")!;

export const metadata: Metadata = {
  title: "Foundation Pack — Get found by AI and Google in 4 weeks (R12,500)",
  description:
    "No website yet? We build everything you need to get found online — website, Google Business Profile, schema markup, social setup, directory listings — all in 4 weeks. R12,500. 50% to start, 50% on delivery.",
  alternates: { canonical: `${site.url}/foundation` },
  openGraph: {
    title: "Foundation Pack — Built to be found by AI from day one",
    description:
      "Most agencies build pretty websites that AI engines can't read. We build what AI engines need to recommend you — website, schema, citations, social setup, all in 4 weeks for R12,500.",
    url: `${site.url}/foundation`,
  },
};

const faqs = [
  {
    q: "Why R12,500 — I've seen R3,000 websites on Fiverr?",
    a: "You can absolutely get a R3,000 website. What you can't get for R3,000 is structured data that AI engines can read, a verified Google Business Profile, 10 trusted directory listings, schema markup, and a 30-minute walkthrough that hands you the keys. The Fiverr site is a brochure. The Foundation Pack is the full digital setup that makes you findable in 2026.",
  },
  {
    q: "Can't I just build it myself on Wix or WordPress?",
    a: "Yes, you can. Wix is fine if you only need a brochure. Where it falls short: you won't get cited by ChatGPT, Claude, or Perplexity because those engines read schema markup and entity data — not Wix's drag-and-drop output. If your customers ask AI 'best [your service] near me' and you've built on Wix without the technical layer, you're invisible. We deploy the technical layer.",
  },
  {
    q: "I already have a Facebook page. Isn't that enough?",
    a: "It used to be. In 2026, customers search Google AND ask ChatGPT before calling. A Facebook page alone gets you about 30% of the way. The other 70% — Google Business Profile, schema, citations — is what we build. Your Facebook page becomes one channel of many, not your only digital footprint.",
  },
  {
    q: "Do I own everything? What if we part ways?",
    a: "You own all of it. The domain is registered in your name. The website lives in your hosting account. Google Business Profile is yours. All logins are handed over in a PDF. If you want to fire us tomorrow, nothing breaks. This is your business, not ours.",
  },
  {
    q: "What if I don't have a logo or photos?",
    a: "We'll use placeholder branding to launch on time. If you want logo design or professional photos, that's available as an add-on (Brand Identity Mini, R3,500). Most clients launch with placeholder branding and upgrade in month 2-3 once revenue justifies it.",
  },
  {
    q: "Why 4 weeks? Why not faster?",
    a: "Two reasons. First, Google Business Profile verification takes 5-14 days regardless of who's working on it (postcard, video, or phone). Second, schema markup and citation listings need to be done properly the first time — rushing creates duplicate listings or wrong NAP data that's painful to clean up later. Four weeks is the honest minimum to do it right.",
  },
  {
    q: "Will you keep updating the site after delivery?",
    a: "60-day support window is included for small fixes. Beyond that, you can either maintain it yourself (we hand over full documentation), book us hourly, or roll into a Growth retainer for ongoing AI visibility work. Most clients run their own site for the first 6 months and join Growth once they want to scale.",
  },
  {
    q: "What if you build it and AI still doesn't find me?",
    a: "Foundation Pack creates the technical layer AI needs. AI citations themselves are a 60-180 day process — engines need to crawl, index, and trust your entity. We can't promise ChatGPT will cite you in week 5. We CAN promise the technical foundation is correct, which is what citations are built on. The Free AI Visibility Scan, run 90 days post-launch, is included so you can measure progress.",
  },
];

// 9 deliverables expanded with what they actually mean
const deliverables = [
  {
    icon: Globe,
    title: "Live 5-page website on your own domain",
    plain:
      "Home, About, Services, Contact, plus one custom page (FAQ, Pricing, Portfolio — your call). Built on Next.js, hosted on Vercel, fast on mobile.",
  },
  {
    icon: MapPin,
    title: "Google Business Profile claimed and verified",
    plain:
      "We handle the verification process (postcard, video, or phone). Profile fully filled out: hours, services, photos, descriptions, Q&A. The single biggest local visibility lever in South Africa.",
  },
  {
    icon: Code2,
    title: "Schema markup deployed",
    plain:
      "The technical code AI engines actually read. Organization, LocalBusiness, Service, FAQ, and BreadcrumbList schema. This is what most R3,000 sites skip — and why those sites stay invisible to ChatGPT and Perplexity.",
  },
  {
    icon: Share2,
    title: "Facebook + Instagram set up or refreshed",
    plain:
      "Pages set up properly with consistent branding. 5 starter posts on each platform, written by us, ready to publish. Hashtags, link-in-bio, contact buttons all configured.",
  },
  {
    icon: ListChecks,
    title: "10 directory listings",
    plain:
      "Brabys, Cylex, Yellosa, Showme, Hellopeter, and 5 more relevant to your industry. Same name, same address, same phone (NAP) on every listing — the citation consistency Google rewards.",
  },
  {
    icon: Mail,
    title: "Business email on your domain",
    plain:
      "you@yourbusiness.co.za instead of yourbusiness@gmail.com. Set up via Google Workspace or Zoho Mail. One mailbox included; more available at cost.",
  },
  {
    icon: PhoneCall,
    title: "30-minute walkthrough call",
    plain:
      "We sit on a call and walk you through every login, every page, every setting. You finish the call confident you can run this without us if you choose to.",
  },
  {
    icon: FileText,
    title: "Documentation PDF + all logins",
    plain:
      "Single PDF with every URL, login, and password. Where the domain is registered (and how to renew it), where hosting is, how to update content. Belongs to you forever.",
  },
  {
    icon: ShieldCheck,
    title: "60-day support window",
    plain:
      "After delivery, 60 days of free email support for small fixes — broken links, content tweaks, login help. Most clients use about 2 hours of support during this window.",
  },
];

const beforeAfter = [
  {
    label: "Customer Googles your business name",
    before:
      "First page of Google: nothing. Maybe a competitor. Your business doesn't exist online to them.",
    after:
      "Your website is the first result. Google Business Profile sidebar shows hours, photos, reviews, directions. Trust earned in 4 seconds.",
  },
  {
    label: "Customer asks ChatGPT 'best [service] in Pretoria'",
    before:
      "ChatGPT recommends your competitors. You're not in the conversation.",
    after:
      "Your business is in the citation pool. Citations take 60-180 days to compound, but the technical foundation is in place from week 4.",
  },
  {
    label: "Customer searches Google Maps for nearby businesses",
    before: "Don't appear. Or appear with no photos, no hours, no reviews.",
    after:
      "Verified Google Business Profile shows you in the local 3-pack with full info. Customers tap 'Call' or 'Directions' immediately.",
  },
  {
    label: "Customer visits your website on mobile",
    before:
      "No website to visit. Maybe a Facebook page from 2019 with old hours.",
    after:
      "Fast-loading mobile site, your service clearly explained, contact form works, WhatsApp button taps directly through.",
  },
];

export default function FoundationPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Foundation Pack", href: "/foundation" },
          ]),
          serviceJsonLd({
            name: foundation.name,
            description: foundation.description,
            price: foundation.price,
          }),
          faqJsonLd(faqs),
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Foundation Pack · For businesses with no website</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            No website yet?
            <br />
            <span className="text-ink-500">Built to be found by AI from day one.</span>
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Website, Google Business Profile, schema markup, social setup, directory listings —
            everything you need to be findable by ChatGPT, Google, and customers in 4 weeks.
            R12,500. Pay 50% to start, 50% on delivery.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/scan?tier=foundation" variant="primary" size="lg">
              Build my foundation <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              Book a free 20-min call first
            </Button>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { label: "R12,500", sub: "Pay 50% to start" },
            { label: "4 weeks", sub: "Delivery, start to keys" },
            { label: "60 days", sub: "Free support after launch" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-rule bg-white p-5 text-center shadow-soft"
            >
              <div className="text-base font-semibold text-ink-900">
                {item.label}
              </div>
              <div className="mt-1 text-sm text-ink-500">{item.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* The Problem */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>The honest problem</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          In 2026, &quot;I&apos;ll get to the website later&quot; costs you customers every week.
        </h2>
        <div className="mt-8 space-y-5 text-ink-700 leading-relaxed">
          <p>
            Your customers do three things before calling you: they Google your business name,
            they look at Google Maps, and increasingly they ask ChatGPT or Perplexity
            for recommendations. If you&apos;re not in any of those three places, you don&apos;t
            exist to them — even if you&apos;ve been operating for 20 years.
          </p>
          <p>
            The hard part: you can have a Facebook page, a phone number on Brabys, and a Gmail
            address — and still be invisible. Because AI engines read{" "}
            <span className="font-semibold text-ink-900">structured data</span>: schema markup,
            verified Google Business Profile entries, citation consistency. None of which Facebook
            gives you.
          </p>
          <p>
            That&apos;s the gap Foundation Pack closes. Not with a R3,000 brochure site. With the
            full digital setup AI engines need to recommend you.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-700" />
            <div>
              <div className="font-semibold text-ink-900">Why most cheap websites still leave you invisible</div>
              <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                Wix, Fiverr, and most R3,000 web devs build pretty websites that AI engines can&apos;t read.
                They skip schema markup, ignore Google Business Profile setup, and don&apos;t do citation
                listings. The site looks fine on a phone — but ChatGPT still recommends your competitor.
                Foundation Pack does the technical layer most agencies skip.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* What's actually included — 9 deliverables */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Exactly what you receive</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            9 things shipped. No surprises.
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Every line item below is a tangible deliverable — something you can log into,
            point to, or hand to your accountant.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="rounded-2xl border border-rule bg-white p-6 shadow-soft"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-semibold tracking-tight text-ink-900">
                  {d.title}
                </div>
                <p className="mt-2 text-sm text-ink-700 leading-relaxed">{d.plain}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Before / After */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">What changes for you</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Before launch vs after launch.
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-4xl space-y-4">
          {beforeAfter.map((row) => (
            <div
              key={row.label}
              className="rounded-2xl border border-rule bg-white p-6 shadow-soft md:p-8"
            >
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-600">
                {row.label}
              </div>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-rule bg-ink-50/40 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                    <XCircle className="h-4 w-4 text-ink-400" />
                    Before
                  </div>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{row.before}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    After Foundation Pack
                  </div>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{row.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Who this is for / NOT for */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <Eyebrow>Honesty before payment</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Who Foundation Pack is — and isn&apos;t — for.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-800">
              Right fit if you...
            </div>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              {[
                "Run a real business (3+ months trading) with no current website",
                "Want to be found on Google AND by AI engines like ChatGPT",
                "Are willing to spend 10 minutes filling a structured brief",
                "Want one round of revisions, not endless tweaks",
                "Plan to keep operating in South Africa for the next 2+ years",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-rule bg-white p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-500">
              Wrong fit if you...
            </div>
            <ul className="mt-4 space-y-3 text-sm text-ink-700">
              {[
                "Already have a working website — start with the Starter Audit instead",
                "Need an e-commerce store with payments — talk to a Shopify specialist",
                "Want a logo and brand identity but no website yet — book the Brand Mini add-on",
                "Need it shipped in under 2 weeks (Foundation Lite is 2 weeks, R6,500)",
                "Want fancy custom illustrations or video production — different scope",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-ink-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* How we work — condensed */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>How it actually goes</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          From clicking buy to keys handed over.
        </h2>

        <ol className="mt-10 space-y-5">
          {[
            {
              n: "01",
              t: "You buy or book (5 min)",
              d: "Pay 50% deposit (R6,250) via card or EFT. Or book a free 20-min discovery call first.",
            },
            {
              n: "02",
              t: "You fill the brief (10 min)",
              d: "8-question structured form. Logo, photos, colour preferences, 3 competitors you respect. Done.",
            },
            {
              n: "03",
              t: "We build (3-4 weeks)",
              d: "Status updates every 3 days. Google Business Profile verification kicks off in week 1. Website + schema deployed week 2-3. Citations + social in week 3-4.",
            },
            {
              n: "04",
              t: "You approve, we wrap (1-5 days)",
              d: "30-min walkthrough call. One round of revisions if needed. Pay second 50% (R6,250). PDF with all logins handed over.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="flex gap-5 rounded-2xl border border-rule bg-white p-6 shadow-soft"
            >
              <div className="font-mono text-sm text-accent-600">{step.n}</div>
              <div>
                <div className="text-base font-semibold text-ink-900">{step.t}</div>
                <p className="mt-2 text-sm text-ink-700 leading-relaxed">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 text-center">
          <Button href="/how-we-work" variant="ghost" size="md">
            See the full process →
          </Button>
        </div>
      </Section>

      {/* Lite alternative */}
      <Section variant="tinted" padding="lg" containerSize="narrow">
        <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-12">
          <Eyebrow>Smaller budget?</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
            Foundation Lite — R6,500
          </h2>
          <p className="mt-4 text-base text-ink-700 leading-relaxed">
            Sole trader or single-service business? Foundation Lite is the simpler version.{" "}
            <span className="font-semibold text-ink-900">1-page website</span>, Google Business
            Profile, schema markup, one social platform set up, 5 directory listings, 5 starter
            posts. Same Method, smaller scope, 2-week delivery.
          </p>
          <ul className="mt-6 grid gap-2 text-sm text-ink-700 md:grid-cols-2">
            {foundationLite.receives.slice(0, 6).map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/scan?tier=foundation-lite" variant="primary" size="md">
              Start Foundation Lite <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="ghost" size="md">
              Compare all tiers
            </Button>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <Eyebrow>Common questions</Eyebrow>
        <h2 className="mt-4 text-display-md font-semibold tracking-tight text-ink-900">
          Everything people ask before they pay.
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-rule bg-white p-6 transition-shadow open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink-900">
                {faq.q}
                <span className="mt-1 flex-shrink-0 text-accent-600 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-base text-ink-700 leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section variant="default" padding="default">
        <div className="mx-auto max-w-3xl rounded-3xl bg-ink-gradient p-12 text-center text-white shadow-lift">
          <h2 className="text-display-md font-semibold tracking-tight">
            Ready to be findable?
          </h2>
          <p className="mt-4 text-base text-ink-300">
            R12,500 total. R6,250 to start. 4 weeks to keys handed over.
            Or book a free 20-min call if you want to talk first — no pitch, no pressure.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/scan?tier=foundation" variant="ink" size="lg">
              Build my foundation <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              href="/contact"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10"
            >
              Book a free call
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
