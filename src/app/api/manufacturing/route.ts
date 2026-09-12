import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  MANUFACTURING_DEFAULTS,
  MANUFACTURING_TABLE_SQL,
} from "@/lib/manufacturing-defaults";

// ───────────────────────────────────────────────────────────────────────────
// One-time-per-process bootstrap
//
// 1. Creates the ManufacturingItem table if the database predates it
//    (raw SQL valid on both MySQL and SQLite — no manual migration step).
// 2. Seeds the canonical 8 manufacturing cards once; rows are only created
//    when the name is absent, so admin edits are never overwritten.
// ───────────────────────────────────────────────────────────────────────────
let ensurePromise: Promise<void> | null = null;

function ensureManufacturingDefaults(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await db.$executeRawUnsafe(MANUFACTURING_TABLE_SQL);

      const existing = await db.manufacturingItem.findMany({
        select: { id: true, name: true },
      });
      const byName = new Set(existing.map(m => m.name));

      const missing = MANUFACTURING_DEFAULTS.filter(m => !byName.has(m.name));
      for (const m of missing) {
        try {
          await db.manufacturingItem.create({
            data: {
              name: m.name,
              tagline: m.tagline,
              description: m.description,
              image: m.image,
              features: JSON.stringify(m.features),
              icon: m.icon,
              order: m.order,
            },
          });
        } catch (err) {
          // Another instance may have created it concurrently — ignore
          // unique/primary violations, rethrow anything else.
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
      console.error("ensureManufacturingDefaults failed (will retry on next request):", err);
      ensurePromise = null;
      throw err;
    });
  }
  return ensurePromise;
}

export async function GET(request: NextRequest) {
  try {
    await ensureManufacturingDefaults().catch(() => null);

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const items = await db.manufacturingItem.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { order: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching manufacturing items:", error);
    return NextResponse.json(
      { error: "Failed to fetch manufacturing items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureManufacturingDefaults().catch(() => null);

    const body = await request.json();
    const { name, tagline, description, image, features, icon, order } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const item = await db.manufacturingItem.create({
      data: {
        name,
        tagline: tagline || "",
        description,
        image: image || "",
        features: features || "[]",
        icon: icon || "Factory",
        order: order || 0,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating manufacturing item:", error);
    return NextResponse.json(
      { error: "Failed to create manufacturing item" },
      { status: 500 }
    );
  }
}
