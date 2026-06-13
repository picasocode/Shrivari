import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { active: true };
    if (category && (category === "ongoing" || category === "completed")) {
      where.category = category;
    }

    const projects = await db.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, client, location, description, imageUrl, category, order } =
      body;

    if (!name || !client || !location || !description) {
      return NextResponse.json(
        { error: "Name, client, location, and description are required" },
        { status: 400 }
      );
    }

    const project = await db.project.create({
      data: {
        name,
        client,
        location,
        description,
        imageUrl: imageUrl || "",
        category: category || "ongoing",
        order: order || 0,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
