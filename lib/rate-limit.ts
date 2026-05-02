/**
 * Lightweight in-memory rate limiter for scan submissions.
 *
 * MVP-stage abuse barrier — protects against:
 *   - bot scrapers hitting /api/scan/start in a loop (cost leak)
 *   - duplicate submissions from the same email (unnecessary API spend)
 *   - browser-refresh double-submits
 *
 * Two limits applied in sequence:
 *   1. PER-IP: 1 scan per IP per 5 minutes (hard block on bursts)
 *   2. PER-EMAIL: 1 scan per email per 24 hours (no duplicate scans)
 *
 * Limitations (acceptable at this scale):
 *   - In-memory: state is per-instance and resets on redeploy. For a real
 *     distributed limiter we'd back this with Vercel KV — but that adds
 *     latency + a dependency for a problem that doesn't exist yet.
 *   - On Vercel serverless, multiple cold instances may not share state.
 *     This is a feature for our use case: a determined attacker has to
 *     spread requests across instances, which still slows them down 10x.
 *
 * Migration path: when traffic justifies it, swap the in-memory Map
 * for `kv.set(key, ts, { ex: ttlSeconds })` and `kv.get(key)`.
 */

type Limit = "ip" | "email";

interface LimitConfig {
  maxRequests: number;
  windowMs: number;
}

const LIMITS: Record<Limit, LimitConfig> = {
  ip: { maxRequests: 1, windowMs: 5 * 60 * 1000 }, // 1 per 5 min
  email: { maxRequests: 1, windowMs: 24 * 60 * 60 * 1000 }, // 1 per 24 hr
};

// Maps storing recent submissions: key -> array of timestamps
const ipBuckets = new Map<string, number[]>();
const emailBuckets = new Map<string, number[]>();

function getBucket(limit: Limit): Map<string, number[]> {
  return limit === "ip" ? ipBuckets : emailBuckets;
}

/**
 * Check whether the given key (IP or email) is currently rate-limited.
 *
 * Returns:
 *   - { allowed: true } if the request can proceed (and updates the bucket)
 *   - { allowed: false, retryAfterSeconds } if rate-limited
 */
export function checkLimit(
  limit: Limit,
  key: string,
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  if (!key) return { allowed: true };

  const config = LIMITS[limit];
  const bucket = getBucket(limit);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get existing timestamps + filter to current window
  const stamps = (bucket.get(key) ?? []).filter((t) => t > windowStart);

  if (stamps.length >= config.maxRequests) {
    const oldestInWindow = stamps[0];
    const retryAfterMs = oldestInWindow + config.windowMs - now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  // Allow + record
  stamps.push(now);
  bucket.set(key, stamps);
  return { allowed: true };
}

/**
 * Extract the client IP from a Vercel/Next.js request.
 * Vercel sets `x-forwarded-for` and `x-real-ip` automatically.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  // x-forwarded-for can be a comma-separated list (client, proxy1, proxy2)
  // The first entry is the real client IP.
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * Format a retry-after duration into a friendly user message.
 */
export function formatRetryAfter(seconds: number): string {
  if (seconds < 60) return `${seconds} seconds`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)} minutes`;
  if (seconds < 86_400) return `${Math.ceil(seconds / 3600)} hours`;
  return `${Math.ceil(seconds / 86_400)} days`;
}
