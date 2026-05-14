/**
 * /admin/scans — Kabelo's submission inbox + manual scan trigger.
 *
 * Production-hardened admin dashboard:
 *   - HttpOnly cookie session (set via /api/admin/login, never JS-set)
 *   - SameSite=Strict prevents CSRF on action endpoints
 *   - All data I/O wrapped — no white screens on KV outage
 *   - Email addresses masked by default (reveal-on-click client island)
 *   - Robots no-index + no public links → not findable accidentally
 *   - 401 / 403 / 500 / empty-state branches all rendered as actual UI
 *
 * Auth flow (intended sequence):
 *   1. First visit:   /admin/scans?token=<TOKEN>
 *      → server detects ?token, redirects to /api/admin/login?token=…
 *   2. Login route:   validates token, sets HttpOnly cookie,
 *      303-redirects back to /admin/scans (clean URL)
 *   3. Subsequent visits: cookie carries the token; this page reads
 *      the cookie via `cookies()` and verifies it
 *
 * The page itself never reads or echoes the raw token — it's verified
 * server-side, never sent to the client bundle, never written to HTML.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  listIndex,
  getStatus,
  getResult,
  getScanMeta,
  type IndexEntry,
  type ScanMeta,
} from "@/lib/storage/scanStore";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminFromComponent,
} from "@/lib/admin-auth";
import { ScanRowActions } from "@/components/admin/scan-row-actions";
import { Section, Eyebrow } from "@/components/ui/section";
import { MaskedEmail } from "@/components/admin/masked-email";
import { IndexNowButton } from "@/components/admin/indexnow-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Scans",
  // Belt-and-braces: noindex + nofollow on the page metadata. Robots.txt
  // handles the broader prefix; this catches any page-level scrapers.
  robots: { index: false, follow: false, nocache: true },
};

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

type DecoratedRow = IndexEntry & {
  status: string;
  score: number | null;
  meta: ScanMeta;
};

type FetchOutcome =
  | { ok: true; rows: DecoratedRow[] }
  | { ok: false; reason: "kv-failed"; message: string };

export default async function AdminScansPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // STEP A: if `?token=…` arrived in the URL, hand off to the login
  // route which sets the HttpOnly cookie via Set-Cookie header. This
  // keeps the token out of HTML / browser history entirely (login
  // redirects 303 to the clean /admin/scans).
  if (params.token) {
    redirect(
      `/api/admin/login?token=${encodeURIComponent(params.token)}&next=/admin/scans`,
    );
  }

  // STEP B: read the HttpOnly cookie and validate.
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const auth = verifyAdminFromComponent({ cookieToken });

  if (!auth.ok) {
    return <UnauthorizedView reason={auth.reason} />;
  }

  // STEP C: fetch the data — wrapped so a KV failure produces an
  // explicit error UI instead of a stack trace.
  const fetched = await safeFetchScans(100);
  if (!fetched.ok) {
    return <ServerErrorView message={fetched.message} />;
  }

  const rows = fetched.rows;
  const metrics = computeMetrics(rows);

  return (
    <Section variant="default" padding="lg">
      <div className="mx-auto max-w-7xl">
        <Header
          rowCount={rows.length}
          recentCount={metrics.last7Days}
        />

        <MetricsBar metrics={metrics} />

        {rows.length === 0 ? (
          <EmptyState />
        ) : (
          <SubmissionsTable rows={rows} />
        )}

        <WorkflowReminder />
      </div>
    </Section>
  );
}

// ─── Header / metrics / table ─────────────────────────────────────

function Header({
  rowCount,
  recentCount,
}: {
  rowCount: number;
  recentCount: number;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <Eyebrow>Admin · Scans</Eyebrow>
        <h1 className="mt-3 text-display-md font-semibold tracking-tight text-ink-900">
          Submission inbox
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          {rowCount} indexed submission{rowCount === 1 ? "" : "s"}
          {" · "}
          {recentCount} in the last 7 days
          {" · "}
          recent-first · click &quot;Run scan&quot; to trigger the paid
          Claude+web_search call.
        </p>
      </div>
      <div className="flex flex-wrap items-start gap-2">
        <IndexNowButton />
        <a
          href="/api/diagnostics"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-rule bg-white px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
        >
          Diagnostics →
        </a>
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="rounded-full border border-rule bg-white px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

function MetricsBar({ metrics }: { metrics: ReturnType<typeof computeMetrics> }) {
  const cards: { label: string; value: string; tone?: string }[] = [
    {
      label: "Last 7 days",
      value: String(metrics.last7Days),
    },
    {
      label: "Scan completed",
      value: pct(metrics.scanCompletedRate),
      tone:
        metrics.scanCompletedRate != null && metrics.scanCompletedRate >= 80
          ? "good"
          : "warn",
    },
    {
      label: "Manual fallback",
      value: pct(metrics.manualFallbackRate),
      tone: "info",
    },
    {
      label: "User email failure",
      value: pct(metrics.userEmailFailedRate),
      tone:
        metrics.userEmailFailedRate != null &&
        metrics.userEmailFailedRate > 0
          ? "warn"
          : "good",
    },
    {
      label: "Handled / Emailed",
      value: `${metrics.handledCount} / ${metrics.emailedCount}`,
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-rule bg-white p-4 shadow-soft"
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">
            {c.label}
          </div>
          <div
            className={`mt-1 text-xl font-semibold ${
              c.tone === "good"
                ? "text-emerald-700"
                : c.tone === "warn"
                  ? "text-amber-700"
                  : c.tone === "info"
                    ? "text-accent-700"
                    : "text-ink-900"
            }`}
          >
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function SubmissionsTable({ rows }: { rows: DecoratedRow[] }) {
  return (
    <div className="mt-8 overflow-x-auto rounded-2xl border border-rule bg-white shadow-soft">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-rule bg-ink-50/40 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
          <tr>
            <th className="px-4 py-3">Submitted</th>
            <th className="px-4 py-3">Business</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Sector</th>
            <th className="px-4 py-3">Emails</th>
            <th className="px-4 py-3">Scan</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Workflow</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {rows.map((r) => (
            <tr key={r.scanId} className="hover:bg-ink-50/30">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-500">
                {formatRelative(r.submittedAt)}
              </td>
              <td className="px-4 py-3 font-medium text-ink-900">
                {r.businessName || "—"}
                <div className="text-[10px] font-mono text-ink-400">
                  {r.scanId}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="text-ink-700">{r.contactName || "—"}</div>
                <MaskedEmail email={r.email} />
              </td>
              <td className="px-4 py-3 text-xs text-ink-700">
                {r.industry || "—"}
                <div className="text-[10px] text-ink-500">
                  {[r.city, r.country].filter(Boolean).join(", ") || "—"}
                </div>
              </td>
              <td className="px-4 py-3">
                <EmailStatusPills row={r} />
              </td>
              <td className="px-4 py-3">
                <ScanStatusPill status={r.status} />
              </td>
              <td className="px-4 py-3">
                {r.score != null ? (
                  <span className="font-mono text-sm text-ink-900">
                    {r.score}
                    <span className="text-xs text-ink-400">/100</span>
                  </span>
                ) : (
                  <span className="text-xs text-ink-400">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <WorkflowPills meta={r.meta} />
              </td>
              <td className="px-4 py-3 text-right">
                <ScanRowActions
                  scanId={r.scanId}
                  status={r.status}
                  meta={r.meta}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkflowReminder() {
  return (
    <div className="mt-8 rounded-2xl border border-rule bg-ink-50/40 p-5 text-xs text-ink-600 leading-relaxed">
      <strong className="text-ink-900">Workflow:</strong> (1){" "}
      <em>Run scan</em> to spend ~$0.30 on the Claude+web_search call —
      ~30-50s to complete. (2) <em>View result</em> at{" "}
      <code className="rounded bg-white px-1 py-0.5">/scan/[id]/results</code>{" "}
      — verify GBP, citations, competitor list against what you know.
      (3) Email the prospect with the link and your personalised summary.
      (4) Mark <em>Handled</em> + <em>Emailed</em> to keep your inbox clear.
    </div>
  );
}

// ─── Status + workflow pills ──────────────────────────────────────

function ScanStatusPill({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    complete: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      label: "Complete",
    },
    scanning: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      label: "Scanning",
    },
    failed: { bg: "bg-rose-100", text: "text-rose-700", label: "Failed" },
    unknown: { bg: "bg-ink-100", text: "text-ink-600", label: "Pending" },
  };
  const s = styles[status] ?? styles.unknown;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}

function EmailStatusPills({ row }: { row: DecoratedRow }) {
  // Older index entries (predating the email-flag extension) won't have
  // these flags. Render "—" rather than guessing — telling the truth
  // about what we don't know is more useful than implying success.
  const userKnown = typeof row.userEmailSent === "boolean";
  const adminKnown = typeof row.adminEmailSent === "boolean";

  return (
    <div className="flex flex-col gap-1">
      <span
        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
          userKnown
            ? row.userEmailSent
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
            : "bg-ink-100 text-ink-500"
        }`}
        title={
          userKnown
            ? row.userEmailSent
              ? "Confirmation email delivered to user"
              : "Confirmation email FAILED to send"
            : "Email status not captured for this submission"
        }
      >
        User: {userKnown ? (row.userEmailSent ? "sent" : "failed") : "—"}
      </span>
      <span
        className={`inline-flex w-fit rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
          adminKnown
            ? row.adminEmailSent
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
            : "bg-ink-100 text-ink-500"
        }`}
        title={
          adminKnown
            ? row.adminEmailSent
              ? "Admin notification delivered"
              : "Admin notification FAILED"
            : "Email status not captured for this submission"
        }
      >
        Admin: {adminKnown ? (row.adminEmailSent ? "sent" : "failed") : "—"}
      </span>
    </div>
  );
}

function WorkflowPills({ meta }: { meta: ScanMeta }) {
  return (
    <div className="flex flex-wrap gap-1">
      {meta.handled ? (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          Handled
        </span>
      ) : null}
      {meta.emailed ? (
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
          Emailed
        </span>
      ) : null}
      {meta.archived ? (
        <span className="rounded-full bg-ink-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-600">
          Archived
        </span>
      ) : null}
      {!meta.handled && !meta.emailed && !meta.archived ? (
        <span className="text-[10px] text-ink-400">—</span>
      ) : null}
    </div>
  );
}

// ─── Error / empty / unauthorised views ───────────────────────────

function UnauthorizedView({
  reason,
}: {
  reason: "no-token-configured" | "missing" | "invalid";
}) {
  const isMissing = reason === "missing";
  const isMisconfigured = reason === "no-token-configured";
  // 401 for missing, 403 for invalid, 503 for misconfigured. Next.js doesn't
  // let us set a status from a server component — but we render the right
  // page and document the intent in the heading.
  const heading = isMisconfigured
    ? "ADMIN_TOKEN not configured"
    : isMissing
      ? "401 Unauthorized — access token required"
      : "403 Forbidden — invalid admin token";

  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-md rounded-3xl border border-rule bg-white p-8 shadow-soft">
        <Eyebrow>Admin · Scans</Eyebrow>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
          {heading}
        </h1>
        <p className="mt-3 text-sm text-ink-700 leading-relaxed">
          {isMisconfigured ? (
            <>
              Set the{" "}
              <code className="rounded bg-ink-50 px-1 py-0.5">ADMIN_TOKEN</code>{" "}
              environment variable in Vercel (24+ characters, random) and
              redeploy. Then visit{" "}
              <code className="rounded bg-ink-50 px-1 py-0.5">
                /admin/scans?token=&lt;TOKEN&gt;
              </code>{" "}
              to authenticate.
            </>
          ) : isMissing ? (
            <>
              Append{" "}
              <code className="rounded bg-ink-50 px-1 py-0.5">
                ?token=&lt;TOKEN&gt;
              </code>{" "}
              to the URL on first visit. The server will set an HttpOnly
              cookie and clean the URL automatically — subsequent visits
              don&apos;t need the URL parameter.
            </>
          ) : (
            <>
              The token in your session cookie didn&apos;t match the
              configured admin token. Either the token rotated, your cookie
              was tampered with, or you signed in to a different environment.
              Re-authenticate by visiting{" "}
              <code className="rounded bg-ink-50 px-1 py-0.5">
                /admin/scans?token=&lt;TOKEN&gt;
              </code>
              .
            </>
          )}
        </p>
        {!isMisconfigured && (
          <form action="/api/admin/logout" method="POST" className="mt-5">
            <button
              type="submit"
              className="rounded-full border border-rule bg-white px-4 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50"
            >
              Clear cookie + sign out
            </button>
          </form>
        )}
      </div>
    </Section>
  );
}

function ServerErrorView({ message }: { message: string }) {
  return (
    <Section variant="tinted" padding="lg">
      <div className="mx-auto max-w-md rounded-3xl border border-rose-200 bg-rose-50/40 p-8 shadow-soft">
        <Eyebrow>Admin · Scans</Eyebrow>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900">
          500 — server error reading scans
        </h1>
        <p className="mt-3 text-sm text-ink-700 leading-relaxed">
          {message}
        </p>
        <p className="mt-3 text-xs text-ink-500">
          Check Vercel logs for details. Most likely cause: KV storage
          unconfigured or temporarily unreachable. Set{" "}
          <code className="rounded bg-white px-1 py-0.5">KV_REST_API_URL</code>{" "}
          and{" "}
          <code className="rounded bg-white px-1 py-0.5">
            KV_REST_API_TOKEN
          </code>{" "}
          if missing.
        </p>
      </div>
    </Section>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-3xl border border-dashed border-rule bg-white p-10 text-center text-sm text-ink-500">
      No submissions in the index yet. New submissions appear here
      automatically. If you&apos;re missing earlier submissions (predating
      the index), check your inbox at{" "}
      <code className="rounded bg-ink-50 px-1 py-0.5">
        kabelo@kabelomore.com
      </code>{" "}
      — every submission also fires an admin notification email.
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

async function safeFetchScans(limit: number): Promise<FetchOutcome> {
  let entries: IndexEntry[];
  try {
    entries = await listIndex(limit);
  } catch (err) {
    console.error(
      "[admin/scans page] listIndex failed:",
      err instanceof Error ? err.message.slice(0, 300) : String(err),
    );
    return {
      ok: false,
      reason: "kv-failed",
      message: "Couldn't read the scan index. KV may be unconfigured or down.",
    };
  }

  const rows = await Promise.all(
    entries.map(async (e): Promise<DecoratedRow> => {
      let status = "unknown";
      let score: number | null = null;
      let meta: ScanMeta = {};

      try {
        status = (await getStatus(e.scanId)) ?? "unknown";
      } catch (err) {
        console.error(
          `[admin/scans page] getStatus(${e.scanId}) failed:`,
          err instanceof Error ? err.message.slice(0, 300) : String(err),
        );
      }

      if (status === "complete") {
        try {
          const r = await getResult(e.scanId);
          score = r?.score ?? null;
        } catch (err) {
          console.error(
            `[admin/scans page] getResult(${e.scanId}) failed:`,
            err instanceof Error ? err.message.slice(0, 300) : String(err),
          );
        }
      }

      try {
        meta = await getScanMeta(e.scanId);
      } catch (err) {
        console.error(
          `[admin/scans page] getScanMeta(${e.scanId}) failed:`,
          err instanceof Error ? err.message.slice(0, 300) : String(err),
        );
      }

      return { ...e, status, score, meta };
    }),
  );

  return { ok: true, rows };
}

function computeMetrics(rows: DecoratedRow[]) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const isRecent = (iso: string) => {
    const t = new Date(iso).getTime();
    return Number.isFinite(t) && t >= sevenDaysAgo;
  };
  const total = rows.length;
  const last7Days = rows.filter((r) => isRecent(r.submittedAt)).length;
  const scanCompleted = rows.filter((r) => r.status === "complete").length;

  const userEmailKnown = rows.filter(
    (r) => typeof r.userEmailSent === "boolean",
  );
  const userEmailFailed = userEmailKnown.filter(
    (r) => r.userEmailSent === false,
  ).length;

  const fallbackKnown = rows.filter(
    (r) => typeof r.manualFallback === "boolean",
  );
  const fallbackCount = fallbackKnown.filter(
    (r) => r.manualFallback === true,
  ).length;

  return {
    total,
    last7Days,
    scanCompletedRate: total === 0 ? null : ratio(scanCompleted, total),
    manualFallbackRate:
      fallbackKnown.length === 0
        ? null
        : ratio(fallbackCount, fallbackKnown.length),
    userEmailFailedRate:
      userEmailKnown.length === 0
        ? null
        : ratio(userEmailFailed, userEmailKnown.length),
    handledCount: rows.filter((r) => r.meta?.handled === true).length,
    emailedCount: rows.filter((r) => r.meta?.emailed === true).length,
  };
}

function ratio(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function pct(n: number | null): string {
  if (n == null) return "—";
  return `${n}%`;
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return iso;
  const diff = Date.now() - then;
  const min = Math.round(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
