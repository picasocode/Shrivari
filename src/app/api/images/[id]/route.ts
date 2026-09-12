import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureMediaTable } from "@/lib/media";

// Serves admin-uploaded images straight from the database. Every upload gets
// a unique id, so the URL never changes once created — safe to cache forever.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureMediaTable().catch(() => null);

    const { id } = await params;
    const media = await db.media.findUnique({ where: { id } });

    if (!media) {
      return new NextResponse("Image not found", { status: 404 });
    }

    return new NextResponse(new Uint8Array(media.data), {
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(media.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Failed to serve image", { status: 500 });
  }
}
