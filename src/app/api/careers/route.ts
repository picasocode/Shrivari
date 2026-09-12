import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { CAREER_DEFAULTS, CAREER_TABLE_SQL } from "@/lib/manufacturing-defaults";

// ───────────────────────────────────────────────────────────────────────────
// One-time-per-process bootstrap: creates the Career table if the database
// predates it (raw SQL valid on MySQL + SQLite) and seeds the canonical
// openings once. Rows are only created when the title is absent, so admin
// edits are never overwritten.
// ───────────────────────────────────────────────────────────────────────────
let ensurePromise: Promise<void> | null = null;

function ensureCareerDefaults(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await db.$executeRawUnsafe(CAREER_TABLE_SQL);

      const existing = await db.career.findMany({ select: { id: true, title: true } });
      const byTitle = new Set(existing.map(c => c.title));

      const missing = CAREER_DEFAULTS.filter(c => !byTitle.has(c.title));
      for (const c of missing) {
        try {
          await db.career.create({
            data: {
              title: c.title,
              location: c.location,
              experience: c.experience,
              department: c.department,
              type: c.type,
              icon: c.icon,
              accent: c.accent,
              order: missing.indexOf(c) + 1,
            },
          });
        } catch (err) {
          if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code?: string }).code === "P2002"
          ) {
            continue;
          }
          throw err;
        }
      }
    })().catch(err => {
      console.error("ensureCareerDefaults failed (will retry on next request):", err);
      ensurePromise = null;
      throw err;
    });
  }
  return ensurePromise;
}

export async function GET(request: NextRequest) {
  try {
    await ensureCareerDefaults().catch(() => null);

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { active: true } : {};

    const careers = await db.career.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(careers);
  } catch (error) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { error: "Failed to fetch careers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, experience, department, type, icon, accent, order } = body;

    if (!title || !location || !experience || !department) {
      return NextResponse.json(
        { error: "Title, location, experience, and department are required" },
        { status: 400 }
      );
    }

    const career = await db.career.create({
      data: {
        title,
        location,
        experience,
        department,
        type: type || "Full-time",
        icon: icon || "Briefcase",
        accent: accent || "#1B3A5C",
        order: order || 0,
      },
    });

    return NextResponse.json(career, { status: 201 });
  } catch (error) {
    console.error("Error creating career:", error);
    return NextResponse.json(
      { error: "Failed to create career" },
      { status: 500 }
    );
  }
}
