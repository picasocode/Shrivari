import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";

/**
 * Maintenance endpoint (Task 76, web-corrections PDF item #9):
 * normalizes fully-uppercase testimonial author names to Title Case.
 * Dotted initials are preserved ("M.N. RAJASEKARAN" -> "M.N. Rajasekaran").
 *
 * Protected: requires the admin email + password (verified with the same
 * pbkdf2 scheme as /api/auth/login). Idempotent — a second run changes nothing.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "");
    const password = String(body?.password ?? "");
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.active || !verifyPassword(password, user.password)) {
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
