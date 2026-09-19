import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Public DB healthcheck for deployment diagnostics.
 *
 * Returns ONLY sanitized information:
 *   - ok:            whether a `SELECT 1` round-trip succeeded
 *   - dbHost:        hostname:port parsed from DATABASE_URL (no credentials)
 *   - dbUrlSet:      whether DATABASE_URL exists at all
 *   - code / message: Prisma/MySQL error code + sanitized message
 *     (MySQL access-denied messages include the app server's outbound IP,
 *      which is exactly what needs to be whitelisted in Hostinger's
 *      Remote MySQL ACL — passwords are never echoed)
 *   - latencyMs:     time spent until first success/failure
 */

function sanitizeMessage(raw: string): string {
  return raw
    // Redact any connection string that might appear in an error body
    .replace(/mysql:\/\/[^\s"']+/gi, "mysql://<redacted>")
    .replace(/password[=:]\s*[^\s&"']+/gi, "password=<redacted>")
    .slice(0, 500);
}

export async function GET() {
  const rawUrl = process.env.DATABASE_URL ?? "";
  const dbUrlSet = rawUrl.length > 0;

  let dbHost = "unknown";
  if (dbUrlSet) {
    try {
      dbHost = new URL(rawUrl).host || "unparseable";
    } catch {
      dbHost = "unparseable-url";
    }
  }

  const started = Date.now();
  try {
    await Promise.race([
      db.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("healthcheck gave up after 8000ms (query hung)")),
          8000
        )
      ),
    ]);

    return NextResponse.json({
      ok: true,
      dbUrlSet,
      dbHost,
      latencyMs: Date.now() - started,
    });
  } catch (error) {
    const err = error as { code?: string; error_code?: string; message?: string };
    return NextResponse.json(
      {
        ok: false,
        dbUrlSet,
        dbHost,
        code: err.code ?? err.error_code ?? "unknown",
        message: sanitizeMessage(String(err.message ?? error)),
        latencyMs: Date.now() - started,
      },
      { status: 500 }
    );
  }
}
