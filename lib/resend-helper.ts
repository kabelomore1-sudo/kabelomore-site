/**
 * Resend SDK wrapper that converts the SDK's soft-fail behavior into
 * thrown exceptions.
 *
 * THE BUG THIS FIXES:
 *
 * The Resend SDK v4 returns `{ data, error }` from `emails.send()`.
 * The promise RESOLVES SUCCESSFULLY even when Resend rejects the email
 * (invalid recipient, domain not verified, account suspended, etc.).
 *
 * If you write:
 *
 *   await resend.emails.send({...});
 *   markAsSent = true;   // BUG: this runs even when the email failed
 *
 * ...you get false-positive success states.
 *
 * THE FIX:
 *
 *   const { data, error } = await resend.emails.send({...});
 *   if (error) throw new Error(error.message);
 *
 * Wrapping this in a single helper means every caller gets correct
 * error semantics with one line: `await sendEmailOrThrow(resend, ...)`.
 *
 * The error message includes:
 *   - Resend's error name (e.g. 'validation_error')
 *   - Resend's error message (e.g. 'You can only send testing emails...')
 *   - Status code if present
 *
 * This makes failures visible in logs + diagnostics + UI flags.
 */

import type { Resend, CreateEmailResponseSuccess } from "resend";

type EmailParams = Parameters<Resend["emails"]["send"]>[0];

/**
 * Send an email via Resend. Throws on any API error so the caller
 * can rely on standard try/catch + await semantics.
 *
 * Returns the success data (which contains the Resend message id)
 * when the email is accepted.
 */
export async function sendEmailOrThrow(
  resend: Resend,
  params: EmailParams,
): Promise<CreateEmailResponseSuccess> {
  const { data, error } = await resend.emails.send(params);

  if (error) {
    // Resend errors have shape { name: string; message: string; statusCode?: number }
    // but the SDK exports it as a strict union type. Cast through unknown to
    // pull the fields out defensively for log/diagnostic surface.
    const errorRecord = error as unknown as {
      name?: string;
      message?: string;
      statusCode?: number;
    };
    const name = errorRecord.name ?? "ResendError";
    const message = errorRecord.message ?? JSON.stringify(error);
    const statusFragment =
      typeof errorRecord.statusCode === "number"
        ? ` [${errorRecord.statusCode}]`
        : "";

    throw new Error(`Resend ${name}${statusFragment}: ${message}`);
  }

  if (!data) {
    // Defensive — shouldn't happen if error is null, but guard anyway
    throw new Error(
      "Resend returned neither data nor error — unexpected response shape.",
    );
  }

  return data;
}
