"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Send, CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

const inputClasses =
  "w-full rounded-xl border border-rule bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-300 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20";

export function ScanForm({ defaultTier }: { defaultTier?: string }) {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ message: "Something went wrong. Please try again." }));
        throw new Error(error.message ?? "Submission failed.");
      }

      setState({ status: "success" });
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? err.message
            : "Could not submit. Please try emailing kabelo@kabelomore.com directly.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-accent-200 bg-accent-50 p-8 text-center md:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500 text-white">
          <CircleCheck className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
          Got it — your scan is in the queue.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-ink-700 leading-relaxed">
          You'll receive a 2-page report at the email you provided within 24 hours.
          If anything looks off, reply to that email and we'll fix it. Talk soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-ink-900">
            Business name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            placeholder="e.g. OMS Lifting Solutions"
            className={cn("mt-2", inputClasses)}
            autoComplete="organization"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-ink-900">
            City &amp; country *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            placeholder="e.g. Pretoria, South Africa"
            className={cn("mt-2", inputClasses)}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-ink-900">
            Website (if any)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            placeholder="https://"
            className={cn("mt-2", inputClasses)}
            autoComplete="url"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-ink-900">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            placeholder="e.g. Industrial supplier · Law firm · Medical practice"
            className={cn("mt-2", inputClasses)}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-ink-900">
            Your name *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            required
            className={cn("mt-2", inputClasses)}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink-900">
            Your email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={cn("mt-2", inputClasses)}
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="services" className="block text-sm font-medium text-ink-900">
          1-2 services you want to be found for
        </label>
        <textarea
          id="services"
          name="services"
          rows={3}
          placeholder="e.g. crane inspection in Gauteng · BBBEE Level 1 lifting equipment supplier"
          className={cn("mt-2", inputClasses, "resize-y")}
        />
      </div>

      {/* Honeypot — leave hidden, bots fill it, humans don't */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {defaultTier && (
        <input type="hidden" name="tier" value={defaultTier} />
      )}

      {state.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div className="flex flex-col items-start gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-500">
          24-hour turnaround. No obligation. We never share your details.
        </p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={state.status === "submitting"}
        >
          {state.status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Request my free scan <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
