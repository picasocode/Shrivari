import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const where = activeOnly ? { active: true } : {};

    const teamMembers = await db.teamMember.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      designation,
      responsibility,
      experience,
      initials,
      gradientFrom,
      gradientTo,
      accent,
      linkedinUrl,
      order,
    } = body;

    if (!name || !designation) {
      return NextResponse.json(
        { error: "Name and designation are required" },
        { status: 400 }
      );
    }

    const teamMember = await db.teamMember.create({
      data: {
        name,
        designation,
        responsibility: responsibility || "",
        experience: experience || 0,
        initials: initials || "",
        gradientFrom: gradientFrom || "#1B3A5C",
        gradientTo: gradientTo || "#2A5F8F",
        accent: accent || "#1B3A5C",
        linkedinUrl: linkedinUrl || "",
        order: order || 0,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
