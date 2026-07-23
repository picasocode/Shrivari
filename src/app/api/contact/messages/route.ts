import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, read } = body;

    if (!id || typeof read !== "boolean") {
      return NextResponse.json(
        { error: "id and read (boolean) are required" },
        { status: 400 }
      );
    }

    const existing = await db.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    const message = await db.contactMessage.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating contact message:", error);
    return NextResponse.json(
      { error: "Failed to update contact message" },
      { status: 500 }
    );
  }
}
