import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { SITE_SETTINGS_DEFAULTS } from "@/lib/site-settings-defaults";

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();

    // Start from the bundled defaults so every editable key is always
    // present (the admin Settings screen renders whatever this returns),
    // then let stored database values win.
    const settingsObj: Record<string, string> = { ...SITE_SETTINGS_DEFAULTS };
    for (const setting of settings) {
      settingsObj[setting.key] = setting.value;
    }

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Accept BOTH payloads:
    //   - a single setting: { key, value }        (used by targeted edits)
    //   - a bulk map:      { key1: v1, key2: v2 } (used by admin "Save All")
    const entries: Array<[string, string]> = [];
    if (body && typeof body === "object" && !Array.isArray(body)) {
      const record = body as Record<string, unknown>;
      if (typeof record.key === "string" && record.value !== undefined) {
        entries.push([record.key, String(record.value)]);
      } else {
        for (const [key, value] of Object.entries(record)) {
          entries.push([key, String(value)]);
        }
      }
    }

    if (entries.length === 0) {
      return NextResponse.json(
        { error: "key and value are required (or provide a map of settings)" },
        { status: 400 }
      );
    }

    for (const [key, value] of entries) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    return NextResponse.json({ updated: entries.length });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
