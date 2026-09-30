import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// One-time data bootstrap: ensures the 2007 factory milestone exists in its
// correct chronological slot (between 2005 order=4 and 2009 order=5).
// Idempotent — skipped when a 2007 row (or a Chettipedu entry) already exists.
// Cached per process; on failure the cache is reset so the next request retries.
let ensureFactoryMilestonePromise: Promise<void> | null = null;

function ensureFactoryMilestone(): Promise<void> {
  if (!ensureFactoryMilestonePromise) {
    ensureFactoryMilestonePromise = (async () => {
      try {
        const existing = await db.milestone.findFirst({
          where: {
            OR: [{ year: "2007" }, { description: { contains: "Chettipedu" } }],
          },
        });
        if (existing) return;

        // Open a slot at order 5, then insert the 2007 milestone there.
        await db.milestone.updateMany({
          where: { order: { gte: 5 } },
          data: { order: { increment: 1 } },
        });
        await db.milestone.create({
          data: {
            year: "2007",
            title: "Factory Started",
            description:
              "Factory started at Chettipedu, Sriperumbudur TK, Kancheepuram.",
            icon: "Factory",
            color: "#1B3A5C",
            order: 5,
            active: true,
          },
        });
      } catch (error) {
        console.error("ensureFactoryMilestone skipped:", error);
        ensureFactoryMilestonePromise = null; // retry on next request
      }
    })();
  }
  return ensureFactoryMilestonePromise;
}

export async function GET(request: NextRequest) {
  try {
    await ensureFactoryMilestone();

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { active: true } : {};

    const milestones = await db.milestone.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, title, description, icon, color, order } = body;

    if (!year || !title || !description) {
      return NextResponse.json(
        { error: "Year, title, and description are required" },
        { status: 400 }
      );
    }

    const milestone = await db.milestone.create({
      data: {
        year,
        title,
        description,
        icon: icon || "Rocket",
        color: color || "#1B3A5C",
        order: order || 0,
      },
    });

    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}
