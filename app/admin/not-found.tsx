/**
 * Not-found boundary for /admin/*. Replaces Next.js's default 404
 * with a small, non-leaky message scoped to the admin section.
 *
 * Why scoped: a 404 inside /admin shouldn't reveal whether other admin
 * routes exist. This page is identical regardless of which admin path
 * the visitor hit.
 */

export default function AdminNotFound() {
  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <div className="rounded-3xl border border-rule bg-white p-8 shadow-soft">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          404 — Not found
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-900">
          That admin route doesn&apos;t exist.
        </h1>
        <p className="mt-3 text-sm text-ink-700 leading-relaxed">
          Go to{" "}
          <a
            href="/admin/scans"
            className="text-accent-600 underline-offset-2 hover:underline"
          >
            /admin/scans
          </a>{" "}
          for the submission inbox. If you intended a different admin page,
          double-check the URL — admin paths aren&apos;t linked publicly.
        </p>
      </div>
    </main>
  );
}
