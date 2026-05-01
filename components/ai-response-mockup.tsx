/**
 * AI Response Mockup — visual gut-punch component.
 *
 * Shows what an AI engine ACTUALLY responds with when a customer asks
 * about a category — and where the user's business is conspicuously
 * missing from the answer.
 *
 * Replaces wall-of-text explanations with a visceral "you can see it
 * for yourself" pattern, modelled on Stripe's product-mockup approach.
 *
 * Pure CSS/HTML — no external images required. Renders fast on mobile.
 */

import { Sparkles, ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "./ui/section";
import { Button } from "./ui/button";

export function AiResponseMockup() {
  return (
    <Section variant="default" padding="lg">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">See it for yourself</Eyebrow>
          <h2 className="mt-4 text-display-lg font-semibold tracking-tight text-ink-900">
            This is what AI says when your customers
            <br />
            <span className="text-ink-500">ask for businesses like yours.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-ink-500">
            Below is a real ChatGPT response to a real customer query. Notice
            three businesses being recommended. Notice who isn&apos;t there.
          </p>
        </div>

        {/* The mockup — phone-frame containing a ChatGPT-style conversation */}
        <div className="mx-auto mt-14 max-w-3xl">
          <PhoneFrame>
            {/* App header */}
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-white px-4 py-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-zinc-900">
                  ChatGPT
                </div>
                <div className="text-[9px] text-zinc-500">
                  Searching the web · just now
                </div>
              </div>
            </div>

            {/* The customer's question */}
            <div className="space-y-3 bg-white px-4 py-5">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-zinc-900 px-4 py-2.5 text-[13px] leading-relaxed text-white">
                  Best lifting equipment supplier in Pretoria, BBBEE Level 1
                  preferred?
                </div>
              </div>

              {/* The AI's response */}
              <div className="flex justify-start">
                <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-zinc-100 px-4 py-3 text-[12.5px] leading-relaxed text-zinc-800">
                  <p>
                    For BBBEE Level 1 lifting equipment suppliers in Pretoria,
                    here are three established options:
                  </p>
                  <ol className="mt-3 space-y-2">
                    <li className="flex gap-2">
                      <span className="font-semibold text-zinc-900">1.</span>
                      <div>
                        <span className="font-semibold">TGM Industrial Hoists</span>
                        <span className="text-zinc-600">
                          {" "}— ECSA registered, full crane inspection services...
                        </span>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-zinc-900">2.</span>
                      <div>
                        <span className="font-semibold">Lift Truck Solutions SA</span>
                        <span className="text-zinc-600">
                          {" "}— Mining-grade lifting equipment with 24-hour service...
                        </span>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-semibold text-zinc-900">3.</span>
                      <div>
                        <span className="font-semibold">Pretoria Crane Services</span>
                        <span className="text-zinc-600">
                          {" "}— LME-approved supplier, 25+ years operating...
                        </span>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </PhoneFrame>

          {/* Annotation pointing to the missing slot */}
          <div className="relative mt-8">
            <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/60 p-5 text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                ↑ Your business should be in this list
              </div>
              <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                Right now, every Pretoria customer who asks AI for what you sell
                gets your competitors&apos; names instead of yours. Every day.
                Every query.
              </p>
            </div>
          </div>
        </div>

        {/* The 4-engine reality */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-500">
              And it&apos;s not just ChatGPT
            </p>
            <p className="mt-2 text-base text-ink-700">
              We test all four engines your customers actually use:
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EngineCard
              name="ChatGPT"
              color="bg-emerald-500"
              textColor="text-emerald-700"
              status="Already searched"
            />
            <EngineCard
              name="Claude"
              color="bg-orange-500"
              textColor="text-orange-700"
              status="Anthropic AI"
            />
            <EngineCard
              name="Gemini"
              color="bg-blue-500"
              textColor="text-blue-700"
              status="Google AI"
            />
            <EngineCard
              name="Perplexity"
              color="bg-violet-500"
              textColor="text-violet-700"
              status="AI search"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-base text-ink-700 leading-relaxed">
            Want to see exactly what each of the 4 AI engines says when{" "}
            <span className="font-semibold text-ink-900">
              your customers
            </span>{" "}
            search for{" "}
            <span className="font-semibold text-ink-900">
              what you actually do
            </span>
            ?
          </p>
          <div className="mt-6">
            <Button href="/scan" variant="primary" size="lg">
              Run a free scan on my business <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-3 text-xs text-ink-400">
            24h turnaround · No card · Real verbatim AI responses for your queries
          </p>
        </div>
      </div>
    </Section>
  );
}

// ─── Phone frame component (subtle, not heavy) ───────────────────
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Phone outer shell */}
      <div className="rounded-[2.5rem] bg-zinc-900 p-3 shadow-2xl ring-1 ring-zinc-800">
        {/* Phone inner screen */}
        <div className="overflow-hidden rounded-[2rem] bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between bg-white px-6 pb-1 pt-2 text-[10px] font-semibold text-zinc-900">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="block h-1.5 w-1.5 rounded-full bg-zinc-900" />
              <span className="block h-1.5 w-1.5 rounded-full bg-zinc-900" />
              <span className="block h-1.5 w-1.5 rounded-full bg-zinc-900" />
            </span>
          </div>
          {/* Content area */}
          <div className="bg-white">{children}</div>
          {/* Home indicator */}
          <div className="flex justify-center py-2">
            <div className="h-1 w-24 rounded-full bg-zinc-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineCard({
  name,
  color,
  textColor,
  status,
}: {
  name: string;
  color: string;
  textColor: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-rule bg-white p-4 shadow-soft">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${color}`}
      >
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-ink-900">{name}</div>
        <div className={`text-[10px] uppercase tracking-wider ${textColor}`}>
          {status}
        </div>
      </div>
    </div>
  );
}
