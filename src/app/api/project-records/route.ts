import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { db } from "@/lib/supabase-db";

export interface ProjectRecord {
  sno: number;
  customer: string;
  voltage: string;
  industry: string;
  scope: string;
  location: string;
  state: string;
  value: string;
  year: string;
}

/** Fallback: read the bundled JSON when the Supabase table is not yet created
 *  (i.e. before the user runs supabase/migrations/0001_project_records.sql). */
async function loadRecordsFromJson(): Promise<ProjectRecord[]> {
  const file = path.join(process.cwd(), "data", "project-records.json");
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as ProjectRecord[];
}

let jsonCache: ProjectRecord[] | null = null;

/** Map a Supabase ProjectRecord row (camelCase columns) to the API shape. */
function mapRow(row: any): ProjectRecord {
  return {
    sno: row.sno ?? 0,
    customer: row.customerName ?? "",
    voltage: row.voltageLevel ?? "",
    industry: row.industry ?? "",
    scope: row.scopeOfWork ?? "",
    location: row.location ?? "",
    state: row.state ?? "",
    value: row.projectValue ?? "",
    year: row.year ?? "",
  };
}

/** Try Supabase first; fall back to the JSON file if the table is missing. */
async function loadRecords(): Promise<{ records: ProjectRecord[]; source: "supabase" | "json" }> {
  try {
    const rows = await db.projectRecord.findMany({
      where: { active: true },
      orderBy: { sno: "asc" },
    });
    if (Array.isArray(rows) && rows.length > 0) {
      return { records: rows.map(mapRow), source: "supabase" };
    }
    // Table exists but empty — still prefer Supabase as the source of truth.
    if (Array.isArray(rows)) {
      return { records: [], source: "supabase" };
    }
  } catch (err) {
    console.warn(
      "[project-records] Supabase query failed, falling back to JSON:",
      (err as Error).message
    );
  }
  if (!jsonCache) jsonCache = await loadRecordsFromJson();
  return { records: jsonCache, source: "json" };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get("industry");
    const state = searchParams.get("state");
    const year = searchParams.get("year");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const limit = parseInt(searchParams.get("limit") || "0", 10);

    const { records, source } = await loadRecords();

    let filtered = records;
    if (industry && industry !== "All") {
      filtered = filtered.filter((r) => r.industry === industry);
    }
    if (state && state !== "All") {
      filtered = filtered.filter((r) => r.state === state);
    }
    if (year && year !== "All") {
      filtered = filtered.filter((r) => r.year === year);
    }
    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.customer.toLowerCase().includes(search) ||
          r.location.toLowerCase().includes(search) ||
          r.state.toLowerCase().includes(search) ||
          r.industry.toLowerCase().includes(search) ||
          r.scope.toLowerCase().includes(search) ||
          r.voltage.toLowerCase().includes(search) ||
          r.year.toLowerCase().includes(search)
      );
    }

    if (limit > 0) filtered = filtered.slice(0, limit);

    return NextResponse.json({
      total: filtered.length,
      records: filtered,
      source,
    });
  } catch (error) {
    console.error("Error loading project records:", error);
    return NextResponse.json(
      { error: "Failed to load project records" },
      { status: 500 }
    );
  }
}
