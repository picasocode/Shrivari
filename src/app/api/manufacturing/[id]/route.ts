import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await db.manufacturingItem.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json(
        { error: "Manufacturing item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching manufacturing item:", error);
    return NextResponse.json(
      { error: "Failed to fetch manufacturing item" },
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

    const existing = await db.manufacturingItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Manufacturing item not found" },
        { status: 404 }
      );
    }

    const item = await db.manufacturingItem.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error updating manufacturing item:", error);
    return NextResponse.json(
      { error: "Failed to update manufacturing item" },
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

    const existing = await db.manufacturingItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Manufacturing item not found" },
        { status: 404 }
      );
    }

    await db.manufacturingItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting manufacturing item:", error);
    return NextResponse.json(
      { error: "Failed to delete manufacturing item" },
      { status: 500 }
    );
  }
}
