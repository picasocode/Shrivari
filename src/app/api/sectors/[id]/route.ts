import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sector = await db.sector.findUnique({ where: { id } });

    if (!sector) {
      return NextResponse.json(
        { error: "Sector not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(sector);
  } catch (error) {
    console.error("Error fetching sector:", error);
    return NextResponse.json(
      { error: "Failed to fetch sector" },
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

    const existing = await db.sector.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Sector not found" },
        { status: 404 }
      );
    }

    const sector = await db.sector.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(sector);
  } catch (error) {
    console.error("Error updating sector:", error);
    return NextResponse.json(
      { error: "Failed to update sector" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.sector.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Sector not found" },
        { status: 404 }
      );
    }

    await db.sector.delete({ where: { id } });

    return NextResponse.json({ message: "Sector deleted successfully" });
  } catch (error) {
    console.error("Error deleting sector:", error);
    return NextResponse.json(
      { error: "Failed to delete sector" },
      { status: 500 }
    );
  }
}
