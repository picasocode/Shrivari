import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Admin editing for project portfolio records (the public Projects page list).
 *
 * Supported fields (all optional — only provided keys are updated):
 *   imageUrl, customerName, voltageLevel, industry, scopeOfWork,
 *   location, state, projectValue, year
 */
const EDITABLE_FIELDS = [
  "imageUrl",
  "customerName",
  "voltageLevel",
  "industry",
  "scopeOfWork",
  "location",
  "state",
  "projectValue",
  "year",
] as const;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await db.projectRecord.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error fetching project record:", error);
    return NextResponse.json(
      { error: "Failed to fetch project record" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.projectRecord.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Only copy whitelisted, string-typed fields.
    const data: Record<string, string> = {};
    for (const field of EDITABLE_FIELDS) {
      const value = body?.[field];
      if (typeof value === "string") {
        data[field] = value.trim();
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No editable fields provided" },
        { status: 400 }
      );
    }

    const updated = await db.projectRecord.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating project record:", error);
    return NextResponse.json(
      { error: "Failed to update project record" },
      { status: 500 }
    );
  }
}
