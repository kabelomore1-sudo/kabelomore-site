/**
 * IndexNow client — pushes URL changes to Bing / Yandex / all
 * IndexNow-participating engines in a single POST.
 *
 * Why IndexNow over relying on crawlers:
 *   - Bing's index also feeds ChatGPT search (OpenAI uses Bing under
 *     the hood for the web search tool). Pushing fresh URLs via
 *     IndexNow gets new content into AI-engine retrieval within
 *     hours, not weeks.
 *   - One POST notifies every participating engine — Bing, Yandex,
 *     Seznam, Naver, etc. No per-engine API to maintain.
 *
 * Key + key file pairing:
 *   The key (INDEXNOW_KEY) and the public verification file (whose
 *   filename IS the key) are matched. Rotating the key requires
 *   replacing the file at the document root too. Treat both as a
 *   pair — never edit one without the other.
 *
 * Operational limits (per IndexNow spec):
 *   - Max 10,000 URLs per single POST
 *   - All URLs must share the same host as `host`
 *   - 200 OK = received
 *   - 202 Accepted = received, validation pending
 *   - 400 = bad request shape
 *   - 403 = key file not reachable at keyLocation
 *   - 422 = URL/host mismatch
 *   - 429 = rate limit (we're submitting too often)
 */

export const INDEXNOW_HOST = "kabelomore.com";

/**
 * IndexNow site verification key.
 *
 * MUST match the filename of the public verification file at
 * /public/{key}.txt. Changing this constant without updating that
 * file (and vice versa) causes IndexNow to reject submissions with
 * a 403.
 */
export const INDEXNOW_KEY = "8ada4b6809cd4d36bd54d21e77525c77";

export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

const INDEXNOW_API = "https://api.indexnow.org/IndexNow";
const MAX_URLS_PER_REQUEST = 10_000;

export interface IndexNowSubmitResult {
  ok: boolean;
  status: number;
  message: string;
  urlCount: number;
}

/**
 * Submit a list of URLs to IndexNow.
 *
 * Returns a structured result rather than throwing — callers (admin
 * dashboard, build scripts, deploy webhooks) decide whether a failed
 * submission is fatal.
 *
 * URL validation:
 *   - All URLs must start with `https://kabelomore.com/`
 *   - Any URL on a different host = 422 from IndexNow, so we reject
 *     locally before wasting an API call
 */
export async function submitToIndexNow(
  urls: string[],
): Promise<IndexNowSubmitResult> {
  if (urls.length === 0) {
    return {
      ok: false,
      status: 0,
      message: "No URLs provided",
      urlCount: 0,
    };
  }

  if (urls.length > MAX_URLS_PER_REQUEST) {
    return {
      ok: false,
      status: 0,
      message: `Cannot submit more than ${MAX_URLS_PER_REQUEST} URLs in a single request — got ${urls.length}`,
      urlCount: urls.length,
    };
  }

  // Reject cross-host URLs before they hit the API. IndexNow returns
  // 422 for these; better to fail fast with a useful message.
  const expectedPrefix = `https://${INDEXNOW_HOST}/`;
  const invalid = urls.filter((u) => !u.startsWith(expectedPrefix));
  if (invalid.length > 0) {
    return {
      ok: false,
      status: 0,
      message: `${invalid.length} URL(s) not on ${INDEXNOW_HOST}. First offender: ${invalid[0]}`,
      urlCount: urls.length,
    };
  }

  try {
    const res = await fetch(INDEXNOW_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: INDEXNOW_KEY_LOCATION,
        urlList: urls,
      }),
    });

    // IndexNow 200/202 = success; anything else = problem
    const ok = res.status === 200 || res.status === 202;
    return {
      ok,
      status: res.status,
      message: ok
        ? `Submitted ${urls.length} URL(s) (HTTP ${res.status})`
        : indexNowErrorMessage(res.status),
      urlCount: urls.length,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      message: `Network error: ${err instanceof Error ? err.message : String(err)}`,
      urlCount: urls.length,
    };
  }
}

/**
 * Fetch the deployed sitemap.xml and extract every URL from it.
 *
 * Convenience for the common "ping everything" case: after a deploy,
 * push every URL in the sitemap to IndexNow in one call.
 *
 * Uses regex extraction rather than an XML parser dependency — the
 * sitemap shape we emit (Next.js metadata API) is consistent, so the
 * regex is reliable. If we ever switch to an XML feed with extensions
 * (lastmod, changefreq, etc.) the regex still works because we only
 * care about <loc> values.
 */
export async function getAllUrlsFromSitemap(): Promise<string[]> {
  const sitemapUrl = `https://${INDEXNOW_HOST}/sitemap.xml`;
  const res = await fetch(sitemapUrl, {
    headers: { "User-Agent": "kabelomore-indexnow/1.0" },
  });
  if (!res.ok) {
    throw new Error(
      `Failed to fetch sitemap (HTTP ${res.status}). URL: ${sitemapUrl}`,
    );
  }
  const xml = await res.text();

  // Extract every <loc>URL</loc> entry. Non-greedy match for safety.
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

// Human-readable error messages for the IndexNow status codes we care
// about. Anything else passes through as raw "HTTP {status}".
function indexNowErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "HTTP 400 — IndexNow rejected the request shape. Check JSON payload structure.";
    case 403:
      return `HTTP 403 — IndexNow could not fetch the key file at ${INDEXNOW_KEY_LOCATION}. Confirm it exists and returns the key string.`;
    case 422:
      return "HTTP 422 — URL host doesn't match `host` in payload. All URLs must be on kabelomore.com.";
    case 429:
      return "HTTP 429 — IndexNow rate-limited the submission. Batch URLs into fewer requests.";
    default:
      return `HTTP ${status} — unexpected IndexNow response.`;
  }
}
