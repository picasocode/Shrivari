import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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
