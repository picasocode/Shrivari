import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { db } from "@/lib/db";

/** Fallback: derive metadata from the bundled JSON file. */
async function metaFromJson() {
  const file = path.join(process.cwd(), "data", "project-records.json");
  const records = JSON.parse(await fs.readFile(file, "utf-8"));
  return {
    total: records.length,
    industries: Array.from(
      new Set(records.map((r: { industry: string }) => r.industry).filter(Boolean))
    ).sort(),
    states: Array.from(
      new Set(records.map((r: { state: string }) => r.state).filter(Boolean))
    ).sort(),
    years: Array.from(
      new Set(records.map((r: { year: string }) => r.year).filter(Boolean))
    ).sort(),
    voltages: Array.from(
      new Set(records.map((r: { voltage: string }) => r.voltage).filter(Boolean))
    ).sort((a: string, b: string) => (parseFloat(a) || 0) - (parseFloat(b) || 0)),
    source: "json" as const,
  };
}

export async function GET() {
  try {
    // Try Supabase first — derive distinct filter values with a single query.
    try {
      const rows = await db.projectRecord.findMany({
        where: { active: true },
        orderBy: { sno: "asc" },
      });
      if (Array.isArray(rows)) {
        const industries = Array.from(
          new Set(rows.map((r: any) => r.industry).filter(Boolean))
        ).sort();
        const states = Array.from(
          new Set(rows.map((r: any) => r.state).filter(Boolean))
        ).sort();
        const years = Array.from(
          new Set(rows.map((r: any) => r.year).filter(Boolean))
        ).sort();
        const voltages = Array.from(
          new Set(rows.map((r: any) => r.voltageLevel).filter(Boolean))
        ).sort((a: string, b: string) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
        return NextResponse.json({
          total: rows.length,
          industries,
          states,
          years,
          voltages,
          source: "supabase",
        });
      }
    } catch (err) {
      console.warn(
        "[project-records/meta] Supabase query failed, falling back to JSON:",
        (err as Error).message
      );
    }

    return NextResponse.json(await metaFromJson());
  } catch (error) {
    console.error("Error loading meta:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
