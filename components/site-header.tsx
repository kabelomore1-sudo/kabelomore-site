import Link from "next/link";
import { Button } from "./ui/button";
import { Container } from "./ui/container";
import { navigation, site } from "@/lib/site";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule/60 bg-white/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-ink-900 hover:text-ink-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-[1.05rem] font-semibold tracking-tight">
              {site.brand}
            </span>
          </Link>

          {/* Primary nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navigation.primary.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-ink-500 hover:text-ink-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden sm:inline-flex text-sm text-ink-500 hover:text-ink-900"
            >
              Contact
            </Link>
            <Button href={navigation.cta.href} variant="primary" size="sm">
              {navigation.cta.label}
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
