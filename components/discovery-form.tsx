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
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";
import {
  discoveryQuestions,
  getQuestionsForSector,
  getStepLabel,
  TOTAL_STEPS,
  type DiscoveryQuestion,
  type Sector,
} from "@/lib/discovery-questions";

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

  // SUCCESS STATE
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
          within 24 hours. We&apos;ll cover:
        </p>
        <ul className="mx-auto mt-4 max-w-xl space-y-2 text-left text-sm text-ink-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            How AI engines respond when your customers search your services
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            Where your gaps are vs the 3 competitors you named
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            The single highest-leverage fix for your firm right now
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            Recommended tier (or no-pressure honest assessment)
          </li>
        </ul>
        <p className="mt-8 text-sm text-ink-500">
          Want to talk before then? Reply to the email or WhatsApp +27 76 035 1084.
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
