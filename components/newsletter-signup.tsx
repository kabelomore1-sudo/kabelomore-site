"use client";

/**
 * Newsletter Signup Component
 *
 * Captures email addresses for "The AEO Letter" — Kabelo's weekly newsletter.
 * The newsletter is the long-tail conversion engine for visitors who aren't
 * ready to scan or buy today but might convert in 4-12 weeks of nurture.
 *
 * Two variants: 'inline' (compact, for footer/sidebar) and 'card' (boxed, for
 * dedicated landing pages or end-of-content CTAs).
 *
 * POSTs to /api/newsletter/subscribe — which uses Resend to add to a list
 * and send a confirmation email.
 */

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type Variant = "inline" | "card";

export function NewsletterSignup({
  variant = "card",
  source = "general",
}: {
  variant?: Variant;
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Subscription failed");
      }
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className={
          variant === "card"
            ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
            : "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        }
      >
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />
          You&apos;re in. Check your inbox.
        </div>
        <p className="mt-1 text-xs text-emerald-700">
          First issue arrives Thursday. No fluff.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
          The AEO Letter
        </div>
        <p className="text-xs text-ink-600 leading-relaxed">
          Weekly tactics for medical, legal, and industrial firms. SA + UK + US.
          One email a week, no spam.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@yourfirm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            className="flex-1 rounded-full border border-rule bg-white px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "submitting" || !email}
            className="inline-flex items-center justify-center gap-1 rounded-full bg-ink-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "submitting" ? "..." : "Subscribe"}
            {status !== "submitting" && <ArrowRight className="h-3 w-3" />}
          </button>
        </div>
        {status === "error" && (
          <p className="text-xs text-rose-600">
            {errorMessage || "Couldn't subscribe. Try again?"}
          </p>
        )}
      </form>
    );
  }

  // card variant
  return (
    <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft md:p-10">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-600">
        The AEO Letter
      </div>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
        Weekly tactics for medical, legal,
        <br className="hidden md:block" /> and industrial firms.
      </h3>
      <p className="mt-4 text-base text-ink-500 leading-relaxed">
        One email a week. Real audits, real findings, real fixes — drawn from
        the work I&apos;m doing for SA, UK, and US clients. No fluff. Unsubscribe
        in one click.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@yourfirm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          className="flex-1 rounded-full border border-rule bg-white px-5 py-3 text-base text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "submitting" || !email}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-7 py-3 text-base font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
          {status !== "submitting" && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-sm text-rose-600">
          {errorMessage || "Couldn't subscribe right now. Try again?"}
        </p>
      )}
      <p className="mt-3 text-xs text-ink-400">
        We use your email only for the newsletter. Unsubscribe anytime.
      </p>
    </div>
  );
}
