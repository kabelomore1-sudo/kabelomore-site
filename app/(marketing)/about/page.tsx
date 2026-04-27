import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Mogopa to Magaliesberg to London",
  description:
    "Kabelo More is an AI Visibility consultant in Pretoria. Custodian of ancestral land in Mogopa. Co-Founder of Digital Dreamers NPC. Building from South Africa for clients in SA, UK, and US.",
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": `${site.url}/#kabelo`,
            name: site.name,
            jobTitle: "AI Visibility Consultant",
            worksFor: { "@id": `${site.url}/#organization` },
            description:
              "AI Visibility Consultant based in Pretoria. Co-Founder of Digital Dreamers NPC. Custodian of ancestral land in Mogopa.",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Pretoria",
              addressCountry: "ZA",
            },
            url: site.url,
            sameAs: [site.social.linkedin, site.social.instagram].filter(Boolean),
            knowsAbout: [
              "AEO",
              "Answer Engine Optimisation",
              "AI Search Visibility",
              "Local SEO",
              "Digital Marketing",
              "Schema.org Structured Data",
              "Google Business Profile Optimisation",
            ],
          },
        ]}
      />

      {/* Hero */}
      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            From Mogopa
            <br />
            to Magaliesberg
            <br />
            <span className="text-ink-500">to London.</span>
          </h1>
          <p className="mt-7 text-lg text-ink-500 leading-relaxed">
            Custodian of ancestral land. Builder of AI systems. Both require thinking
            in decades. This is the bet I'm making.
          </p>
        </div>
      </Section>

      {/* Story */}
      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="prose-kabelo max-w-none">
          <h2>The Mogopa thread</h2>
          <p>
            My family has been custodians of land in Mogopa, in the Ventersdorp region
            of South Africa, for generations. That land is more than ground — it's a
            commitment that runs across decades. Soil takes seasons. Trees grow over
            generations. Crops fail. Crops succeed. You plan for both.
          </p>
          <p>
            I grew up understanding what it means to think in decades, not quarters.
            That instinct shapes everything I build.
          </p>

          <h2>The path to AI</h2>
          <p>
            I'm a digital marketer with a decade in local SEO — the discipline of
            getting businesses found by customers searching online. For most of that
            time, "search" meant Google's blue links.
          </p>
          <p>
            That's changing. Customers now ask AI engines first. ChatGPT, Claude,
            Gemini, and Perplexity decide which businesses are worth recommending.
            The signals that move AI engines aren't the same as classic SEO — and
            almost no business in South Africa or the UK mid-market has done the work
            yet.
          </p>
          <p>
            I'm spending the next decade closing that gap. The discipline is called
            AEO — Answer Engine Optimisation — and it's the next foundation layer for
            local and professional businesses that depend on being found.
          </p>

          <h2>Digital Dreamers NPC</h2>
          <p>
            Alongside the consulting practice, I co-founded{" "}
            <strong>Digital Dreamers NPC</strong> — a SARS Section 18A registered
            Public Benefit Organisation (PBO No. {site.ngo.pboNumber}) that trains
            rural South African youth in three pillars: digital literacy and
            employability, mapping and geospatial intelligence, and precision
            agriculture.
          </p>
          <p>
            We adapt the Raspberry Pi Foundation's global literacy framework to South
            African rural realities. The teenagers we train today will run the
            agri-tech businesses of the next decade. The corporate CSI partners who
            fund Digital Dreamers are the same firms that need AI visibility help.
            Same conversation, two revenue streams, both legitimate, both
            tax-efficient for donors.
          </p>
          <p>
            Naval Ravikant talks about authenticity as escape from competition. This
            is what he means. Nobody else is building exactly this combination —
            commercial AI consulting plus rural digital literacy plus ancestral land
            custodianship — because it's not a strategy. It's a life.
          </p>

          <h2>Where I work from</h2>
          <p>
            I'm based in Pretoria, South Africa. I serve clients across South Africa,
            the UK, and the US. The currency arbitrage is real and intentional — I
            deliver work to international standards from a local cost base, so
            clients get London-quality service at significantly below London rates.
            Same skills, different cost structure, fair pricing for both sides.
          </p>
          <p>
            Most of my deep work happens in cafes around Brooklyn and Menlyn, on
            hiking trails in Magaliesberg or Hennops, or at home with a flat white.
            The lifestyle isn't a perk. It's the compounding loop: outdoor time
            sharpens thinking, content emerges from real life, expertise builds
            through public documentation.
          </p>

          <h2>What I'm building toward</h2>
          <p>
            The five-year horizon: a Waterkloof home that anchors the family I'm
            building. A working sunflower farm on the Mogopa land that integrates
            Digital Dreamers' precision agriculture pillar. A reassembly factory that
            converts unused industrial capacity into local jobs. The freelance
            practice and the NPC are the engines that fund and validate all of it.
          </p>
          <p>
            R4,000 a month is where I started. R50,000 a month is the next
            milestone. Everything is built on income that compounds.
          </p>
          <p className="text-base italic text-ink-500">
            "Escape competition through authenticity." — Naval Ravikant
          </p>
          <p>
            That's the bet.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button href="/scan" variant="primary" size="md">
            Get a free AI scan <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/services" variant="secondary" size="md">
            See how we work together
          </Button>
        </div>
      </Section>

      {/* Digital Dreamers callout */}
      <Section variant="ink" padding="default">
        <div className="mx-auto max-w-3xl">
          <Eyebrow className="text-accent-400">Digital Dreamers NPC</Eyebrow>
          <h2 className="mt-4 text-display-md font-semibold tracking-tight text-white">
            For high-income professionals: Section 18A donations are tax-deductible.
          </h2>
          <p className="mt-5 text-lg text-ink-300 leading-relaxed">
            Digital Dreamers is a SARS-approved Public Benefit Organisation
            (PBO No. {site.ngo.pboNumber}). Donations qualify for Section 18A tax
            deduction up to 10% of taxable income. For a surgeon at the 45% bracket,
            R50,000 donated = R22,500 back in tax + genuine community impact + BBBEE
            scorecard points (SED + SD).
          </p>
          <div className="mt-8">
            <a
              href={`mailto:${site.contact.email}?subject=Digital%20Dreamers%20donation%20inquiry`}
              className="inline-flex items-center gap-1 text-accent-400 hover:text-accent-300"
            >
              Request the impact dashboard <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
