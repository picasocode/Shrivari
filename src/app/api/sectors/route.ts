import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { active: true } : {};

    const sectors = await db.sector.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(sectors);
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return NextResponse.json(
      { error: "Failed to fetch sectors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      icon,
      stat,
      statLabel,
      gradientFrom,
      gradientTo,
      accent,
      details,
      order,
    } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const sector = await db.sector.create({
      data: {
        name,
        description,
        icon: icon || "Zap",
        stat: stat || "",
        statLabel: statLabel || "",
        gradientFrom: gradientFrom || "#1B3A5C",
        gradientTo: gradientTo || "#2A5F8F",
        accent: accent || "#1B3A5C",
        details: details || "[]",
        order: order || 0,
      },
    });

    return NextResponse.json(sector, { status: 201 });
  } catch (error) {
    console.error("Error creating sector:", error);
    return NextResponse.json(
      { error: "Failed to create sector" },
      { status: 500 }
    );
  }
}
