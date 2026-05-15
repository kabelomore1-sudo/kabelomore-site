import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/jsonld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { ArrowRight, Mail, Linkedin, Instagram } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Kabelo More. Email, LinkedIn, or request a free AI Visibility Scan.",
  alternates: { canonical: `${site.url}/contact` },
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    note: "Best for proposals, quotes, partnership inquiries",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    // Derive the display value from the canonical href so it can never
    // drift from site.social.linkedin again (previously hardcoded to
    // the dead /in/kabelomore slug while href pointed elsewhere).
    value: site.social.linkedin.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    href: site.social.linkedin,
    note: "Best for ongoing professional connection + DMs",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@kabelomore",
    href: site.social.instagram,
    note: "Behind-the-scenes, hike-talks, lifestyle",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ])}
      />

      <Section variant="tinted" padding="lg">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">Contact</Eyebrow>
          <h1 className="mt-4 text-display-xl font-semibold tracking-tight text-ink-900">
            Let's talk.
          </h1>
          <p className="mt-5 text-lg text-ink-500">
            Best place to start: the free AI Visibility Scan. If you'd rather
            email, DM, or jump on a call, all the channels are below.
          </p>

          <div className="mt-10">
            <Button href="/scan" variant="primary" size="lg">
              Start with a free scan <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Section>

      <Section variant="default" padding="lg" containerSize="narrow">
        <div className="space-y-4">
          {channels.map(({ icon: Icon, label, value, href, note }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-5 rounded-2xl border border-rule bg-white p-6 shadow-soft transition-all hover:border-accent-300 hover:shadow-card"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-500 group-hover:bg-accent-50 group-hover:text-accent-600">
                <Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
                  {label}
                </div>
                <div className="mt-1 text-lg font-medium text-ink-900">
                  {value}
                </div>
                <div className="mt-1 text-sm text-ink-500">{note}</div>
              </div>
              <ArrowRight className="h-5 w-5 text-ink-300 transition-all group-hover:translate-x-1 group-hover:text-accent-600" />
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-ink-50 p-6 text-sm text-ink-700">
          <strong className="text-ink-900">Based in Pretoria, South Africa.</strong>{" "}
          Working hours align loosely with SAST (UTC+2) but flexible for UK and US
          calls. Most communication happens async by email — calls scheduled on
          request.
        </div>
      </Section>
    </>
  );
}
