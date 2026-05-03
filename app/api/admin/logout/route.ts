import { buildAdminCookieClearHeader } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/logout
 * GET  /api/admin/logout (link-friendly variant)
 *
 * Clears the admin cookie immediately (Max-Age=0). Returns 303 to /
 * so the user lands on the public homepage after logout.
 *
 * Both verbs are accepted because:
 *  - POST is the correct verb for a state-changing action and is the
 *    default fetch from the dashboard's logout button
 *  - GET is supported as a convenience so an admin can hit
 *    /api/admin/logout in their address bar to nuke a session
 */
export async function POST(req: Request) {
  return clearCookieResponse(req);
}

export async function GET(req: Request) {
  return clearCookieResponse(req);
}

function clearCookieResponse(_req: Request): Response {
  const isProd = process.env.NODE_ENV === "production";
  const header = buildAdminCookieClearHeader(isProd);
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
      "Set-Cookie": header,
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
