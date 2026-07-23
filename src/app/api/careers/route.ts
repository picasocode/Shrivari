import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
