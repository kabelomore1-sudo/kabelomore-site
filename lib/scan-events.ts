/**
 * In-memory tracker for the most recent scan events.
 *
 * Lets the diagnostics endpoint surface what happened on the LAST scan
 * submission without grepping Vercel logs. Critical for debugging email
 * delivery failures in production where the user can't see server logs.
 *
 * Resets on redeploy (acceptable — diagnostics is for live debugging,
 * not historical analysis). When traffic justifies it, swap for KV.
 *
 * Also emits structured JSON logs for every event so Vercel logs are
 * grep-able by event type.
 */

export type ScanEventType =
  | "scan_submitted"
  | "validation_passed"
  | "validation_failed"
  | "honeypot_tripped"
  | "rate_limit_ip"
  | "rate_limit_email"
  | "profile_saved"
  | "PAID_API_CALL_STARTED"
  | "PAID_API_CALL_FINISHED"
  | "PAID_API_CALL_FAILED"
  | "scan_completed"
  | "scan_timed_out"
  | "scan_failed"
  | "user_email_sent"
  | "user_email_failed"
  | "admin_email_sent"
  | "admin_email_failed"
  | "completion_email_sent"
  | "completion_email_failed"
  | "response_returned";

export interface ScanEvent {
  type: ScanEventType;
  timestamp: string;
  scanId?: string;
  data?: Record<string, unknown>;
  // Truncated error message — never the full stack
  error?: string;
}

// Most recent N events (per process instance)
const MAX_EVENTS = 50;
const events: ScanEvent[] = [];

// Most recent submission (for diagnostics quick-look)
let lastSubmission: {
  scanId: string;
  timestamp: string;
  businessName: string;
  email: string;
  flags: {
    submissionSaved: boolean;
    userEmailSent: boolean;
    adminEmailSent: boolean;
    scanCompleted: boolean;
    manualFallback: boolean;
  };
  errors: string[];
} | null = null;

/**
 * Record an event. Logs to Vercel as structured JSON + stores in memory
 * for diagnostics endpoint.
 */
export function recordEvent(event: Omit<ScanEvent, "timestamp">): void {
  const enriched: ScanEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // In-memory ring buffer
  events.unshift(enriched);
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;

  // Structured log for Vercel — grep `event=` in logs to find these
  const logLine = JSON.stringify({
    event: enriched.type,
    scanId: enriched.scanId,
    timestamp: enriched.timestamp,
    ...(enriched.data ?? {}),
    ...(enriched.error ? { error: enriched.error } : {}),
  });

  // Use console.log for "info" events; console.error for failure events
  const isFailure = enriched.type.includes("failed") || enriched.type.includes("error");
  if (isFailure) {
    console.error(logLine);
  } else {
    console.log(logLine);
  }
}

/**
 * Update the last-submission snapshot for diagnostics quick-look.
 */
export function recordSubmission(snapshot: NonNullable<typeof lastSubmission>): void {
  lastSubmission = snapshot;
}

export function getLastSubmission() {
  return lastSubmission;
}

export function getRecentEvents(limit = 20): ScanEvent[] {
  return events.slice(0, limit);
}

/**
 * Truncate an unknown error to a safe string for logging.
 * Never leaks API keys or full stack traces to the client surface.
 */
export function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    // Strip anything that looks like an API key or token
    return err.message
      .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
      .replace(/re_[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
      .slice(0, 500);
  }
  return String(err).slice(0, 500);
}
