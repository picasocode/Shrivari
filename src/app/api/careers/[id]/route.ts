import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const career = await db.career.findUnique({ where: { id } });

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(career);
  } catch (error) {
    console.error("Error fetching career:", error);
    return NextResponse.json(
      { error: "Failed to fetch career" },
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

    const existing = await db.career.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    const career = await db.career.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(career);
  } catch (error) {
    console.error("Error updating career:", error);
    return NextResponse.json(
      { error: "Failed to update career" },
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

    const existing = await db.career.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    await db.career.delete({ where: { id } });

    return NextResponse.json({ message: "Career deleted successfully" });
  } catch (error) {
    console.error("Error deleting career:", error);
    return NextResponse.json(
      { error: "Failed to delete career" },
      { status: 500 }
    );
  }
}
