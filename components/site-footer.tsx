import Link from "next/link";
import { Container } from "./ui/container";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-ink-50">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="text-lg font-semibold tracking-tight text-ink-900">
              {site.brand}
            </div>
            <p className="mt-3 max-w-md text-sm text-ink-500">
              {site.description}
            </p>
            <p className="mt-6 text-sm text-ink-500">
              <span className="text-ink-900">Email</span>{" "}
              <a
                href={`mailto:${site.contact.email}`}
                className="text-accent-600 hover:text-accent-700"
              >
                {site.contact.email}
              </a>
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Services
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-ink-700 hover:text-ink-900">
                  AI Visibility Audit
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-ink-700 hover:text-ink-900">
                  Visibility Build
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-ink-700 hover:text-ink-900">
                  Visibility Partner
                </Link>
              </li>
              <li>
                <Link href="/scan" className="text-ink-700 hover:text-ink-900">
                  Free AI Scan
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="md:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              About
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-ink-700 hover:text-ink-900">
                  Story
                </Link>
              </li>
              <li>
                <Link
                  href="/process"
                  className="text-ink-700 hover:text-ink-900"
                >
                  Process
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-ink-700 hover:text-ink-900"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-ink-700 hover:text-ink-900">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Connect
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-700 hover:text-ink-900"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-700 hover:text-ink-900"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-rule py-8 text-xs text-ink-400 md:flex md:items-center md:justify-between">
          <div>
            © {year} {site.name}. {site.contact.location}.
          </div>
          <div className="mt-2 md:mt-0">
            Co-Founder, {site.ngo.name} · {site.ngo.section18A} · PBO No.{" "}
            {site.ngo.pboNumber}
          </div>
        </div>
      </Container>
    </footer>
  );
}
