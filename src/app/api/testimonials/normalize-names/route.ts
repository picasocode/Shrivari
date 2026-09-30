import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";

/**
 * Maintenance endpoint (Task 76, web-corrections PDF item #9):
 * normalizes fully-uppercase testimonial author names to Title Case.
 * Dotted initials are preserved ("M.N. RAJASEKARAN" -> "M.N. Rajasekaran").
 *
 * Protected: accepts either the admin session cookie (auth-token) or admin
 * email + password (verified with the same pbkdf2 scheme as /api/auth/login).
 * Idempotent — a second run changes nothing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email ?? "");
    const password = String(body?.password ?? "");

    // Auth: (1) admin session cookie from the admin panel, or (2) direct credentials.
    let authed = false;
    const token = request.cookies.get("auth-token")?.value;
    if (token) {
      const session = await db.session.findUnique({
        where: { token },
        include: { user: true },
      });
      if (session && session.expiresAt >= new Date()) authed = true;
    }
    if (!authed && email && password) {
      const user = await db.user.findUnique({ where: { email } });
      if (user && user.active && verifyPassword(password, user.password)) authed = true;
    }
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const all = await db.testimonial.findMany({ select: { id: true, name: true } });
    const fixToken = (t: string) =>
      /[a-z]/.test(t)
        ? t
        : t
            .split(".")
            .map((s) => (s ? s.charAt(0) + s.slice(1).toLowerCase() : ""))
            .join(".");
    const fixName = (n: string) => n.split(/\s+/).map(fixToken).join(" ");

    const updated: { from: string; to: string }[] = [];
    for (const t of all) {
      const fixed = fixName(t.name.trim());
      if (fixed && fixed !== t.name) {
        await db.testimonial.update({ where: { id: t.id }, data: { name: fixed } });
        updated.push({ from: t.name, to: fixed });
      }
    }

    return NextResponse.json({
      ok: true,
      checked: all.length,
      updatedCount: updated.length,
      updated,
    });
  } catch (error) {
    console.error("Error normalizing testimonial names:", error);
    return NextResponse.json(
      { error: "Failed to normalize testimonial names" },
      { status: 500 }
    );
  }
}
