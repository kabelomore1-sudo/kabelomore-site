"use client";

/**
 * The Real Estate Discovery — multi-step interactive form
 *
 * Mobile-first. One question per screen. Progress bar at top.
 * Auto-saves to localStorage so users can resume if they close the tab.
 * Submits to /api/discover on completion.
 *
 * Behaviour:
 *   - Step 1 (3 questions) shown unconditionally
 *   - Once 'sector' is selected, sector-specific questions inject in step 3
 *   - Required questions block the 'Next' button
 *   - 'Back' allowed at any time
 *   - On submit success: confirmation screen with next steps
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Save,
  Loader2,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import {
  discoveryQuestions,
  getQuestionsForSector,
  getStepLabel,
  TOTAL_STEPS,
  type DiscoveryQuestion,
  type Sector,
} from "@/lib/discovery-questions";
import {
  recommendPackage,
  type PackageRecommendation,
} from "@/lib/public-packages";
import { track } from "@/lib/track";

const STORAGE_KEY = "discovery-form-draft";

type AnswerValue = string | string[];

type FormState = Record<string, AnswerValue>;

export function DiscoveryForm() {
  const [answers, setAnswers] = useState<FormState>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  // Computed recommendation, set on successful submit. Drives the
  // success screen — shows personalised package match + reasoning.
  const [recommendation, setRecommendation] =
    useState<PackageRecommendation | null>(null);

  // Fire 'discovery_started' the first time the user enters any answer
  const [hasStarted, setHasStarted] = useState(false);
  useEffect(() => {
    if (!hasStarted && Object.keys(answers).length > 0) {
      track("discovery_started");
      setHasStarted(true);
    }
  }, [answers, hasStarted]);

  // Load saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.answers) setAnswers(parsed.answers);
        if (typeof parsed.currentStep === "number") {
          setCurrentStep(parsed.currentStep);
        }
      }
    } catch {
      /* localStorage unavailable / corrupt — silently start fresh */
    }
  }, []);

  // Auto-save on changes (debounced to ~500ms via the visual indicator)
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, currentStep }),
      );
      setAutoSaved(true);
      const timer = setTimeout(() => setAutoSaved(false), 1500);
      return () => clearTimeout(timer);
    } catch {
      /* ignore storage errors */
    }
  }, [answers, currentStep]);

  // Determine which questions to show based on sector
  const sector = (answers.sector as Sector | "other" | undefined) ?? null;
  const visibleQuestions = getQuestionsForSector(sector);
  const stepQuestions = visibleQuestions.filter((q) => q.step === currentStep);
  const stepMeta = getStepLabel(currentStep);

  // Validate current step — required fields must have values
  const stepIsValid = stepQuestions
    .filter((q) => q.required)
    .every((q) => {
      const value = answers[q.id];
      if (Array.isArray(value)) return value.length > 0;
      return typeof value === "string" && value.trim().length > 0;
    });

  const updateAnswer = useCallback((id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, sector }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Submission failed");
      }

      // ─── MATCHING ENGINE ─────────────────────────────────────────
      // Compute the personalised recommendation client-side from the
      // answers. Deterministic decision tree — no AI, no latency.
      // The recommendation is shown immediately on the success screen.
      const rec = recommendPackage({
        sector: answers.sector as string | undefined,
        averageDealSize: answers.averageDealSize as string | undefined,
        currentDigitalSetup: Array.isArray(answers.currentDigitalSetup)
          ? (answers.currentDigitalSetup as string[])
          : undefined,
        successMetric: answers.successMetric as string | undefined,
        bbbeeLevel: answers.bbbeeLevel as string | undefined,
      });
      setRecommendation(rec);

      // Track funnel events
      track("discovery_completed");
      track("recommendation_shown", {
        packageId: rec.packageId,
        confidence: rec.confidence,
        suggestHumanReview: rec.suggestHumanReview,
      });

      setSubmitted(true);
      // Clear the draft on success
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Try again?",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS STATE — personalised recommendation
  if (submitted && recommendation) {
    return <RecommendationCard recommendation={recommendation} />;
  }

  // SUCCESS STATE fallback (no recommendation, just confirmation)
  if (submitted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 text-center md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-display-md font-semibold tracking-tight text-ink-900">
          Got it. Working on your discovery now.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-ink-700 leading-relaxed">
          You&apos;ll receive your personalised AEO Discovery summary by email
          within 24 hours.
        </p>
        <p className="mt-6 text-sm text-ink-500">
          Want to talk before then? WhatsApp +27 76 035 1084.
        </p>
      </div>
    );
  }

  // FORM STATE
  return (
    <div className="rounded-3xl border border-rule bg-white p-6 shadow-soft md:p-10">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono font-semibold uppercase tracking-[0.14em] text-ink-500">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="flex items-center gap-1 text-ink-400">
            {autoSaved && (
              <>
                <Save className="h-3 w-3" />
                Saved
              </>
            )}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full bg-accent-500 transition-all duration-300"
            style={{
              width: `${(currentStep / TOTAL_STEPS) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step header */}
      <div className="mb-8">
        <h2 className="text-display-sm font-semibold tracking-tight text-ink-900 md:text-display-md">
          {stepMeta.title}
        </h2>
        <p className="mt-2 text-sm text-ink-500 leading-relaxed md:text-base">
          {stepMeta.description}
        </p>
      </div>

      {/* Questions for this step */}
      <div className="space-y-8">
        {stepQuestions.map((q) => (
          <QuestionRenderer
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => updateAnswer(q.id, v)}
          />
        ))}
      </div>

      {/* Error message */}
      {submitError && (
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {submitError}
        </div>
      )}

      {/* Nav buttons */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-1 rounded-full border border-rule bg-white px-5 py-2.5 text-sm font-medium text-ink-700 transition-all hover:border-accent-300 hover:text-accent-700 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {currentStep < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!stepIsValid}
            className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!stepIsValid || submitting}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Discovery
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Reassurance footer */}
      <div className="mt-6 text-center text-xs text-ink-400">
        Your answers auto-save in your browser. Close the tab and come back —
        your progress is saved.
      </div>
    </div>
  );
}

// =============================================================
// Question Renderer — handles each question type
// =============================================================

function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: DiscoveryQuestion;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
}) {
  return (
    <div>
      <label className="block text-base font-semibold text-ink-900 md:text-lg">
        {question.question}
        {question.required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {question.context && (
        <p className="mt-1 text-xs text-ink-500 leading-relaxed md:text-sm">
          {question.context}
        </p>
      )}
      <div className="mt-3">{renderInput(question, value, onChange)}</div>
    </div>
  );
}

function renderInput(
  q: DiscoveryQuestion,
  value: AnswerValue | undefined,
  onChange: (value: AnswerValue) => void,
) {
  const baseInputCls =
    "w-full rounded-xl border border-rule bg-white px-4 py-3 text-base text-ink-900 placeholder:text-ink-400 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30";

  if (q.type === "textarea") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder}
        maxLength={q.maxLength}
        rows={4}
        className={`${baseInputCls} resize-y`}
      />
    );
  }

  if (q.type === "url") {
    return (
      <input
        type="url"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder ?? "https://"}
        className={baseInputCls}
      />
    );
  }

  if (q.type === "email") {
    return (
      <input
        type="email"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder ?? "you@yourfirm.com"}
        className={baseInputCls}
      />
    );
  }

  if (q.type === "select" || q.type === "range-select") {
    return (
      <div className="space-y-2">
        {q.options?.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
              value === opt.value
                ? "border-accent-500 bg-accent-50"
                : "border-rule bg-white hover:border-accent-300"
            }`}
          >
            <input
              type="radio"
              name={q.id}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="mt-1 h-4 w-4 cursor-pointer accent-accent-600"
            />
            <span className="flex-1 text-sm text-ink-900 md:text-base">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (q.type === "multi-select") {
    const arrayValue = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {q.options?.map((opt) => {
          const checked = arrayValue.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                checked
                  ? "border-accent-500 bg-accent-50"
                  : "border-rule bg-white hover:border-accent-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...arrayValue, opt.value]);
                  } else {
                    onChange(arrayValue.filter((v) => v !== opt.value));
                  }
                }}
                className="mt-1 h-4 w-4 cursor-pointer accent-accent-600"
              />
              <span className="flex-1 text-sm text-ink-900 md:text-base">
                {opt.label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  if (q.type === "multi-text") {
    const labels = q.multiLabels ?? ["1", "2", "3"];
    const arrayValue = Array.isArray(value)
      ? value
      : labels.map(() => "");
    // Ensure array length matches labels
    const padded = labels.map((_, i) => arrayValue[i] ?? "");

    return (
      <div className="space-y-3">
        {labels.map((label, idx) => (
          <div key={label}>
            <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-ink-500">
              {label}
            </span>
            <input
              type="text"
              value={padded[idx]}
              onChange={(e) => {
                const next = [...padded];
                next[idx] = e.target.value;
                onChange(next);
              }}
              placeholder={q.placeholder}
              maxLength={q.maxLength ?? 200}
              className={baseInputCls}
            />
          </div>
        ))}
      </div>
    );
  }

  // default text
  return (
    <input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={q.placeholder}
      maxLength={q.maxLength ?? 200}
      className={baseInputCls}
    />
  );
}

// =============================================================
// Recommendation Card — shown on Discovery success
// =============================================================

/**
 * Personalised package recommendation rendered on Discovery success.
 *
 * Layered structure:
 *   1. Confirmation: "Got it. Here's what we recommend."
 *   2. The matched package with reasoning
 *   3. Primary CTA: 'Start [Package]' or 'Apply for [Package]'
 *   4. Secondary CTA: 'Talk to Kabelo' — surfaced more prominently when
 *      confidence is low or suggestHumanReview is true
 *   5. Email expectation: '24-hour personalised summary' promise
 *
 * Tracking:
 *   - Primary CTA click → recommendation_accepted
 *   - Talk to Kabelo click → talk_to_kabelo_clicked
 */
function RecommendationCard({
  recommendation,
}: {
  recommendation: PackageRecommendation;
}) {
  const { package: pkg, reason, confidence, suggestHumanReview } = recommendation;
  const isHighConfidence = confidence === "high";

  const handleAccept = () => {
    track("recommendation_accepted", { packageId: recommendation.packageId });
  };

  const handleTalkToKabelo = () => {
    track("talk_to_kabelo_clicked", { source: "recommendation" });
  };

  return (
    <div className="space-y-6">
      {/* Header: confirmation */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-display-sm font-semibold tracking-tight text-ink-900 md:text-display-md">
              Got it. Here&apos;s what we recommend.
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              Personalised AEO summary email arrives within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* The matched package */}
      <div
        className={`rounded-3xl border-2 bg-white p-7 shadow-lift md:p-10 ${
          isHighConfidence ? "border-accent-500" : "border-amber-300"
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Sparkles
            className={`h-5 w-5 ${
              isHighConfidence ? "text-accent-600" : "text-amber-600"
            }`}
          />
          <span
            className={`text-xs font-semibold uppercase tracking-[0.14em] ${
              isHighConfidence ? "text-accent-600" : "text-amber-700"
            }`}
          >
            {isHighConfidence
              ? "Recommended for you"
              : "Best initial fit (review with Kabelo)"}
          </span>
        </div>

        <h3 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
          {pkg.name}
        </h3>
        <p className="mt-2 text-base font-medium text-accent-600">
          {pkg.positioning}
        </p>

        {/* Reasoning — why this fits THEM */}
        <div className="mt-6 rounded-2xl border border-rule bg-ink-50/40 p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Why this fits you
          </div>
          <p className="mt-2 text-sm text-ink-700 leading-relaxed md:text-base">
            {reason}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <div className="text-3xl font-bold text-ink-900">{pkg.price.sa}</div>
          <div className="text-sm text-ink-500">{pkg.price.intl}</div>
        </div>
        <p className="mt-1 text-xs text-ink-500">{pkg.payment}</p>

        {/* What you get */}
        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            What you get
          </div>
          <ul className="mt-3 space-y-2">
            {pkg.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={pkg.cta.href}
            onClick={handleAccept}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-ink-800 hover:shadow-card"
          >
            {pkg.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Talk to Kabelo fallback — more prominent when confidence is low */}
      <div
        className={`rounded-2xl border p-5 md:p-6 ${
          suggestHumanReview
            ? "border-amber-300 bg-amber-50/60"
            : "border-rule bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <MessageCircle
            className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
              suggestHumanReview ? "text-amber-700" : "text-ink-500"
            }`}
          />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-ink-900 md:text-base">
              {suggestHumanReview
                ? "Want a human review?"
                : "Not what you expected?"}
            </h4>
            <p className="mt-1 text-xs text-ink-700 md:text-sm">
              {suggestHumanReview
                ? "Your situation has nuance. Kabelo will personally review your answers and recommend the right scope — no pressure to commit."
                : "If this doesn't feel right, talk to Kabelo. He'll review your answers and either confirm the match or recommend a custom scope."}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href="https://wa.me/27760351084?text=Hi%20Kabelo%2C%20I%20just%20completed%20the%20Real%20Estate%20Discovery%20and%20want%20a%20human%20review%20before%20committing."
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleTalkToKabelo}
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition-all hover:bg-ink-50"
              >
                Chat on WhatsApp
              </a>
              <a
                href="mailto:kabelo@kabelomore.com?subject=Discovery%20review%20request"
                onClick={handleTalkToKabelo}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rule bg-white px-5 py-2.5 text-sm font-medium text-ink-700 transition-all hover:bg-ink-50"
              >
                Send an email
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="rounded-2xl border border-rule bg-ink-50/40 p-5 text-sm text-ink-600 md:p-6">
        <strong className="text-ink-900">What happens next:</strong>{" "}
        Within 24 hours, Kabelo emails you a personalised summary referencing
        your specific answers. It includes the AEO scan results for your
        firm, your gaps vs the competitors you named, and the highest-leverage
        fix to deploy first. The recommendation above stays consistent — the
        email goes deeper.
      </div>
    </div>
  );
}
